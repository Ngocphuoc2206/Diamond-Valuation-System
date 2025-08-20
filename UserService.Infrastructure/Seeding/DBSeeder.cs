using Microsoft.EntityFrameworkCore;
using UserService.Domain.Entities;
using UserService.Domain.Interfaces;
using UserService.Infrastructure.Data;
using UserService.Infrastructure.Security;

namespace UserService.Infrastructure.Seeding;

public static class DbSeeder
{
    public static async Task SeedAsync(UserDbContext db, IPasswordHasher hasher)
    {
        // Add Roles
        string[] roleNames = { "Guest", "Customer", "ConsultingStaff", "ValuationStaff", "Manager", "Admin" };
        foreach (var name in roleNames)
        {
            if (!await db.Roles.AnyAsync(r => r.Name == name))
            {
                db.Roles.Add(new Role { Name = name, CreatedAt = DateTime.UtcNow });
            }
        }
        await db.SaveChangesAsync();

        //add Admin user 
        var admin = await db.Users.FirstOrDefaultAsync(u => u.UserName == "admin");
        if (admin is null)
        {
            var (hash, salt) = hasher.Hash("Admin#123"); // đổi khi deploy
            admin = new User
            {
                UserName = "admin",
                FullName = "System Administrator",
                Email = "admin@diamond.local",
                PasswordHash = hash,
                PasswordSalt = salt,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            db.Users.Add(admin);
            await db.SaveChangesAsync();

            var adminRoleId = await db.Roles.Where(r => r.Name == "Admin").Select(r => r.Id).FirstAsync();
            db.UserRoles.Add(new UserRole { UserId = admin.Id, RoleId = adminRoleId, CreatedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();
        }

        //Một số user mẫu (customer/staff)
        await EnsureUserWithRole(db, hasher,
            userName: "customer1", email: "customer1@example.com", fullName: "Customer One", role: "Customer", password: "P@ssw0rd!");

        await EnsureUserWithRole(db, hasher,
            userName: "consult1", email: "consult1@example.com", fullName: "Consulting Staff One", role: "ConsultingStaff", password: "P@ssw0rd!");

        await EnsureUserWithRole(db, hasher,
            userName: "valuer1", email: "valuer1@example.com", fullName: "Valuation Staff One", role: "ValuationStaff", password: "P@ssw0rd!");
    }

    private static async Task EnsureUserWithRole(UserDbContext db, IPasswordHasher hasher,
        string userName, string email, string fullName, string role, string password)
    {
        var u = await db.Users.FirstOrDefaultAsync(x => x.UserName == userName);
        if (u is null)
        {
            var (hash, salt) = hasher.Hash(password);
            u = new User
            {
                UserName = userName,
                Email = email,
                FullName = fullName,
                PasswordHash = hash,
                PasswordSalt = salt,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            db.Users.Add(u);
            await db.SaveChangesAsync();
        }

        var roleId = await db.Roles.Where(r => r.Name == role).Select(r => r.Id).FirstAsync();
        var linkExists = await db.UserRoles.AnyAsync(ur => ur.UserId == u.Id && ur.RoleId == roleId);
        if (!linkExists)
        {
            db.UserRoles.Add(new UserRole { UserId = u.Id, RoleId = roleId, CreatedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();
        }
    }
}

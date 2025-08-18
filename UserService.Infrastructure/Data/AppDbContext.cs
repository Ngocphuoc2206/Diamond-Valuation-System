using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                // Configure the User entity
                entity.ToTable("users");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("user_id");
                entity.Property(e => e.UserName).HasColumnName("username");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.FullName).HasColumnName("full_name");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.IsAnonymous).HasColumnName("is_anonymous");
                entity.Property(e => e.RoleId).HasColumnName("role_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.CreatedBy).HasColumnName("created_by");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

                entity.HasOne(e => e.Role)
                    .WithMany()
                    .HasForeignKey(e => e.RoleId);

                // Configure the Role entity
                modelBuilder.Entity<Role>(entity =>
                {
                    entity.ToTable("roles");
                    entity.HasKey(e => e.Id);
                    entity.Property(e => e.Id).HasColumnName("role_id");
                    entity.Property(e => e.Name).HasColumnName("name");
                    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                    entity.Property(e => e.CreatedBy).HasColumnName("created_by");
                    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
                    entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
                });

                //Configure the RefreshToken entity
                modelBuilder.Entity<RefreshToken>(e =>
                {
                    e.HasIndex(x => x.TokenHash).IsUnique();
                    e.Property(x => x.TokenHash).HasMaxLength(200);
                });

                modelBuilder.Entity<Role>().HasData(
                    new Role
                    {
                        Id = 1,
                        Name = "Guest",
                        CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Role
                    {
                        Id = 2,
                        Name = "Customer",
                        CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Role
                    {
                        Id = 3,
                        Name = "Consulting Staff",
                        CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Role
                    {
                        Id = 4,
                        Name = "Valuation Staff",
                        CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Role
                    {
                        Id = 5,
                        Name = "Manager",
                        CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new Role
                    {
                        Id = 6,
                        Name = "Admin",
                        CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    }
                );
            });

            // Seed admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    UserName = "admin",
                    Email = "admin@example.com",
                    PasswordHash = HashPassword("admin123"),
                    FullName = "System Administrator",
                    Gender = 1,
                    IsAnonymous = false,
                    RoleId = 6, // Admin role
                }
            );

            base.OnModelCreating(modelBuilder);
        }
        // Define DbSet
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = default!;
        public DbSet<Role> Roles { get; set; }

        // Hash Password
        public string HashPassword(string password)
        {
           using var sha256 = System.Security.Cryptography.SHA256.Create();
           var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
           return Convert.ToBase64String(bytes);
        }
    }
}

using SharedLibrary.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;

namespace UserService.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        #region Role
        public async Task<ApiResponse<bool>> AssignRoleAsync(AssignRoleDto dto)
        {
            // Find user
            var u = await _unitOfWork.UserRepository.GetByIdAsync(dto.UserId);
            if (u is null) return ApiResponse<bool>.Failure("User not found");

            // Find or create role
            var role = await _unitOfWork.RoleRepository.GetByAsync(r => r.Name == dto.Role);
            if (role is null)
            {
                var created = await _unitOfWork.RoleRepository.CreateAsync(new Role { Name = dto.Role });
                role = created.Data!;
            }

            // Prevent duplicate user-role
            var allUserRoles = await _unitOfWork.UserRoleRepository.GetAllAsync();
            if (allUserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == role.Id))
            {
                return ApiResponse<bool>.CreateSuccessResponse(true, "Role already assigned");
            }

            await _unitOfWork.UserRoleRepository.CreateAsync(new UserRole { UserId = u.Id, RoleId = role.Id });
            return ApiResponse<bool>.CreateSuccessResponse(true, "Role assigned");
        }
        #endregion

        #region Query (paged + filter + search + sort)
        public async Task<ApiResponse<IEnumerable<User>>> GetAllAsync(int page = 1, int size = 20)
        {
            var allUsers = await _unitOfWork.UserRepository.GetAllAsync();
            var data = allUsers.Skip((page - 1) * size).Take(size);
            return ApiResponse<IEnumerable<User>>.CreateSuccessResponse(data, "Users");
        }

        public async Task<ApiResponse<UserDto>> GetByIdAsync(int id)
        {
            var u = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (u is null) return ApiResponse<UserDto>.Failure("Not found");

            // Lấy roles
            var userRoles = await _unitOfWork.UserRoleRepository.GetAllAsync();
            var roles = await _unitOfWork.RoleRepository.GetAllAsync();
            var rlist = userRoles.Where(ur => ur.UserId == u.Id)
                                 .Select(ur => roles.FirstOrDefault(r => r.Id == ur.RoleId))
                                 .Where(r => r != null)
                                 .Select(r => new RoleDto { Id = r!.Id, Name = r!.Name })
                                 .ToList();

            var dto = new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                FullName = u.FullName,
                Phone = u.Phone,
                DateOfBirth = u.DateOfBirth,
                Status = string.IsNullOrWhiteSpace(u.Status) ? "active" : u.Status,
                CreatedAt = u.CreatedAt,
                LastActiveAt = u.LastActiveAt,
                AvatarUrl = u.AvatarUrl,
                Roles = rlist
            };

            return ApiResponse<UserDto>.CreateSuccessResponse(dto);
        }


        public async Task<ApiResponse<PagedResponse<UserDto>>> GetAllUserAsync(UserQuery q)
        {
            // Lấy toàn bộ (repository của bạn hiện chưa expose Include -> gom role thủ công)
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            var userRoles = await _unitOfWork.UserRoleRepository.GetAllAsync();
            var roles = await _unitOfWork.RoleRepository.GetAllAsync();

            // Map userId -> RoleDto[]
            var rolesByUserId = userRoles
                .GroupBy(ur => ur.UserId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(ur =>
                    {
                        var r = roles.FirstOrDefault(x => x.Id == ur.RoleId);
                        return r is null ? null : new RoleDto { Id = r.Id, Name = r.Name };
                    }).Where(x => x != null)!.ToList()!
                );
            IEnumerable<User> query = users;

            if (!string.IsNullOrWhiteSpace(q.Role))
            {
                var roleKey = q.Role.Trim().ToLower();
                if (roleKey == "staff")
                {
                    // nhóm staff: tùy chính sách hệ thống
                    string[] staffRoles = new[] { "consulting_staff", "valuation_staff", "manager" };
                    query = query.Where(u =>
                    {
                        if (!rolesByUserId.TryGetValue(u.Id, out var rlist)) return false;
                        return rlist.Any(r => staffRoles.Contains((r!.Name ?? "").Trim().ToLower()));
                    });
                }
                else
                {
                    query = query.Where(u =>
                    {
                        if (!rolesByUserId.TryGetValue(u.Id, out var rlist)) return false;
                        return rlist.Any(r => string.Equals((r!.Name ?? "").Trim(), q.Role, StringComparison.OrdinalIgnoreCase));
                    });
                }
            }

            if (!string.IsNullOrWhiteSpace(q.Status))
            {
                // cần cột Status trong User entity (string). Nếu chưa có, hãy thêm.
                query = query.Where(u => string.Equals(u.Status, q.Status, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(q.Q))
            {
                var kw = q.Q.Trim().ToLower();
                query = query.Where(u =>
                    (!string.IsNullOrEmpty(u.FullName) && u.FullName.ToLower().Contains(kw)) ||
                    (!string.IsNullOrEmpty(u.Email) && u.Email.ToLower().Contains(kw)) ||
                    (!string.IsNullOrEmpty(u.UserName) && u.UserName.ToLower().Contains(kw))
                );
            }

            // Sort
            var sortBy = (q.SortBy ?? "createdAt").Trim().ToLower();
            var sortDir = (q.SortDir ?? "desc").Trim().ToLower();
            Func<User, object?> keySelector = sortBy switch
            {
                "name" => u => u.FullName,
                "createdat" => u => u.CreatedAt,
                "lastactiveat" => u => u.LastActiveAt,
                _ => u => u.CreatedAt
            };

            query = (sortDir == "asc")
                ? query.OrderBy(keySelector)
                : query.OrderByDescending(keySelector);

            // Paging
            var total = query.Count();
            var page = q.Page <= 0 ? 1 : q.Page;
            var size = q.Size <= 0 ? 20 : q.Size;

            var pageItems = query
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            // Map -> UserDto
            var dtos = pageItems.Select(u => ToDto(u, rolesByUserId.TryGetValue(u.Id, out var r) ? r : new List<RoleDto>())).ToList();

            var paged = new PagedResponse<UserDto>
            {
                Items = dtos,
                Page = page,
                Size = size,
                Total = total
            };

            return ApiResponse<PagedResponse<UserDto>>.CreateSuccessResponse(paged, "Users");
        }
        #endregion

        #region CRUD + Status
        //public async Task<ApiResponse<User>> GetByIdAsync(int id)
        //{
        //    var u = await _unitOfWork.UserRepository.GetByIdAsync(id);
        //    return u is null ? ApiResponse<User>.Failure("Not found") : ApiResponse<User>.CreateSuccessResponse(u);
        //}

        // Admin update theo id (name/email/phone/dob...)
        public async Task<ApiResponse<UserDto>> UpdateByIdAsync(int id, UpdateUserAdminDto dto)
        {
            var u = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (u is null) return ApiResponse<UserDto>.Failure("Not found");

            if (!string.IsNullOrWhiteSpace(dto.FullName)) u.FullName = dto.FullName!;
            if (!string.IsNullOrWhiteSpace(dto.Email)) u.Email = dto.Email!;
            if (!string.IsNullOrWhiteSpace(dto.Phone)) u.Phone = dto.Phone!;
            if (dto.DateOfBirth.HasValue) u.DateOfBirth = dto.DateOfBirth;

            u.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.UserRepository.UpdateAsync(u);

            // Lấy roles để trả về dto đầy đủ
            var userRoles = await _unitOfWork.UserRoleRepository.GetAllAsync();
            var roles = await _unitOfWork.RoleRepository.GetAllAsync();
            var rlist = userRoles.Where(ur => ur.UserId == u.Id)
                                 .Select(ur =>
                                 {
                                     var r = roles.FirstOrDefault(x => x.Id == ur.RoleId);
                                     return r is null ? null : new RoleDto { Id = r.Id, Name = r.Name };
                                 })
                                 .Where(x => x != null)!.ToList()!;
            return ApiResponse<UserDto>.CreateSuccessResponse(ToDto(u, rlist), "Updated");
        }

        public async Task<ApiResponse<User>> UpdateProfileAsync(int id, UpdateProfileDto dto)
        {
            var u = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (u is null) return ApiResponse<User>.Failure("Not found");
            if (dto.FullName is not null) u.FullName = dto.FullName;
            if (dto.Phone is not null) u.Phone = dto.Phone;
            if (dto.DateOfBirth is not null) u.DateOfBirth = dto.DateOfBirth;
            u.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.UserRepository.UpdateAsync(u);
            return ApiResponse<User>.CreateSuccessResponse(u, "Updated");
        }

        // Suspend/Activate
        public async Task<ApiResponse<bool>> UpdateStatusAsync(int id, string status)
        {
            var u = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (u is null) return ApiResponse<bool>.Failure("Not found");

            // Cần property Status trong User entity (string). Nếu chưa có, hãy thêm migration.
            u.Status = status;
            u.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.UserRepository.UpdateAsync(u);
            return ApiResponse<bool>.CreateSuccessResponse(true, "Status updated");
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var u = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (u is null) return ApiResponse<bool>.Failure("Not found");

            await _unitOfWork.UserRepository.DeleteAsync(u);
            return ApiResponse<bool>.CreateSuccessResponse(true, "Deleted");
        }
        #endregion

        #region Bulk
        public async Task<ApiResponse<int>> BulkAsync(BulkActionDto dto)
        {
            if (dto.UserIds is null || !dto.UserIds.Any())
                return ApiResponse<int>.Failure("No user ids");

            var act = (dto.Action ?? "").Trim().ToLower();
            var ids = dto.UserIds.Distinct().ToList();

            var users = (await _unitOfWork.UserRepository.GetAllAsync())
                .Where(u => ids.Contains(u.Id))
                .ToList();

            if (!users.Any()) return ApiResponse<int>.CreateSuccessResponse(0, "No users matched");

            int affected = 0;
            switch (act)
            {
                case "activate":
                    foreach (var u in users)
                    {
                        u.Status = "active";
                        u.UpdatedAt = DateTime.UtcNow;
                        await _unitOfWork.UserRepository.UpdateAsync(u);
                        affected++;
                    }
                    break;

                case "suspend":
                    foreach (var u in users)
                    {
                        u.Status = "suspended";
                        u.UpdatedAt = DateTime.UtcNow;
                        await _unitOfWork.UserRepository.UpdateAsync(u);
                        affected++;
                    }
                    break;

                case "delete":
                    foreach (var u in users)
                    {
                        await _unitOfWork.UserRepository.DeleteAsync(u);
                        affected++;
                    }
                    break;

                default:
                    return ApiResponse<int>.Failure("Unsupported bulk action");
            }

            return ApiResponse<int>.CreateSuccessResponse(affected, "Bulk done");
        }
        #endregion

        #region Helpers
        private static UserDto ToDto(User u, List<RoleDto> roles)
        {
            return new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                FullName = u.FullName,
                Phone = u.Phone,
                DateOfBirth = u.DateOfBirth,
                Status = string.IsNullOrWhiteSpace(u.Status) ? "active" : u.Status,
                CreatedAt = u.CreatedAt,
                LastActiveAt = u.LastActiveAt,
                AvatarUrl = u.AvatarUrl,
                Roles = roles
            };
        }

        #endregion
    }
}

using SharedLibrary.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        public async Task<ApiResponse<bool>> AssignRoleAsync(AssignRoleDto dto)
        {
            var u = await _unitOfWork.UserRepository.GetByIdAsync(dto.UserId);
            if (u is null) return ApiResponse<bool>.Failure("User not found");
            var role = await _unitOfWork.RoleRepository.GetByAsync(r => r.Name == dto.Role)
                       ?? (await _unitOfWork.RoleRepository.CreateAsync(new Role { Name = dto.Role })).Data!;
            await _unitOfWork.UserRoleRepository.CreateAsync(new UserRole { UserId = u.Id, RoleId = role.Id });
            return ApiResponse<bool>.CreateSuccessResponse(true, "Role assigned");
        }

        public async Task<ApiResponse<IEnumerable<User>>> GetAllAsync(int page = 1, int size = 20)
        {
            var allUsers = await _unitOfWork.UserRepository.GetAllAsync();
            var data = allUsers.Skip((page - 1) * size).Take(size);
            return ApiResponse<IEnumerable<User>>.CreateSuccessResponse(data, "Users");
        }

        public async Task<ApiResponse<User>> GetByIdAsync(int id)
        {
            var u = await _unitOfWork.UserRepository.GetByIdAsync(id);
            return u is null ? ApiResponse<User>.Failure("Not found") : ApiResponse<User>.CreateSuccessResponse(u);
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
    }
}

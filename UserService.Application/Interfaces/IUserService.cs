using SharedLibrary.Response;
using UserService.Application.DTOs;
using UserService.Domain.Entities;

namespace UserService.Application.Interfaces;

public interface IUserService
{
    Task<ApiResponse<User>> GetByIdAsync(int id);
    Task<ApiResponse<IEnumerable<User>>> GetAllAsync(int page = 1, int size = 20);
    Task<ApiResponse<User>> UpdateProfileAsync(int id, UpdateProfileDto dto);
    Task<ApiResponse<bool>> AssignRoleAsync(AssignRoleDto dto);
}

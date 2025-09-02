using SharedLibrary.Response;
using UserService.Application.DTOs;
using UserService.Domain.Entities;

namespace UserService.Application.Interfaces;

public interface IUserService
{
    Task<ApiResponse<PagedResponse<UserDto>>> GetAllUserAsync(UserQuery q);
    Task<ApiResponse<UserDto>> GetByIdAsync(int id);
    Task<ApiResponse<bool>> AssignRoleAsync(AssignRoleDto dto);
    Task<ApiResponse<User>> UpdateProfileAsync(int id, UpdateProfileDto dto);
    Task<ApiResponse<UserDto>> UpdateByIdAsync(int id, UpdateUserAdminDto dto);
    Task<ApiResponse<bool>> UpdateStatusAsync(int id, string status);
    Task<ApiResponse<bool>> DeleteAsync(int id);
    Task<ApiResponse<int>> BulkAsync(BulkActionDto dto);
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Application.DTOs
{
    public record RegisterDto(string UserName, string Email, string Password, string FullName);
    public record LoginDto(string UserNameOrEmail, string Password);
    public record TokenResponse(string AccessToken, string RefreshToken, DateTime ExpiresAt);
    public record AssignRoleDto(int UserId, string Role);
    public record UpdateProfileDto(string? FullName, string? Phone, DateTime? DateOfBirth);
    public record TokenRefreshDto(string RefreshToken);
    public record LogoutDto(string? RefreshToken);
}

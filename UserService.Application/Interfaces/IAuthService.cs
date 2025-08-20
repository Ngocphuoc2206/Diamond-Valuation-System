using SharedLibrary.Response;
using UserService.Application.DTOs;

namespace UserService.Application.Services.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<TokenResponse>> RegisterAsync(RegisterDto dto);
    Task<ApiResponse<TokenResponse>> LoginAsync(LoginDto dto, string? ip, string? userAgent);
    Task<ApiResponse<TokenResponse>> RefreshAsync(TokenRefreshDto dto, string? ip, string? userAgent);
    Task<ApiResponse<bool>> LogoutAsync(LogoutDto dto);
}

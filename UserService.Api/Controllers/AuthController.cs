using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.DTOs;
using UserService.Application.Services.Interfaces;

namespace UserService.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _svc;
    public AuthController(IAuthService svc) => _svc = svc;

    [AllowAnonymous, HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
        => Ok(await _svc.RegisterAsync(dto));

    [AllowAnonymous, HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var ua = Request.Headers.UserAgent.ToString();
        return Ok(await _svc.LoginAsync(dto, ip, ua));
    }

    [AllowAnonymous, HttpPost("refresh")]
    public async Task<IActionResult> Refresh(TokenRefreshDto dto)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var ua = Request.Headers.UserAgent.ToString();
        return Ok(await _svc.RefreshAsync(dto, ip, ua));
    }

    [Authorize, HttpPost("logout")]
    public async Task<IActionResult> Logout(LogoutDto dto)
        => Ok(await _svc.LogoutAsync(dto));
}

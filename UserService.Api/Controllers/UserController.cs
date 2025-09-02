using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Security.Claims;
using UserService.Application.DTOs;
using UserService.Application.Interfaces;

namespace UserService.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/user")]
[Authorize] // Cho phép tất cả user đã đăng nhập; action admin sẽ siết role riêng
public class UserController : ControllerBase
{
    private readonly IUserService _svc;
    public UserController(IUserService svc) => _svc = svc;

    // === Profile (user tự cập nhật) =========================================

    /// <summary>
    /// Cập nhật hồ sơ của người dùng đang đăng nhập
    /// PUT /api/user/me
    /// </summary>
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileDto dto)
    {
        // Lấy userId từ JWT (ưu tiên "uid", fallback NameIdentifier)
        var sub = User.FindFirst("uid")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        if (!int.TryParse(sub, out var userId)) return BadRequest("Invalid user id claim");

        var res = await _svc.UpdateProfileAsync(userId, dto);
        return Ok(res);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] UserQuery q)
        => Ok(await _svc.GetAllUserAsync(q));

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _svc.GetByIdAsync(id));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserAdminDto dto)
        => Ok(await _svc.UpdateByIdAsync(id, dto));

    [HttpPost("{id:int}/suspend")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Suspend(int id)
        => Ok(await _svc.UpdateStatusAsync(id, "suspended"));

    [HttpPost("{id:int}/activate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Activate(int id)
        => Ok(await _svc.UpdateStatusAsync(id, "active"));

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
        => Ok(await _svc.DeleteAsync(id));

    [HttpPost("bulk")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Bulk([FromBody] BulkActionDto dto)
        => Ok(await _svc.BulkAsync(dto));

    [HttpPost("assign-role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        // Gán role
        var assignRole = await _svc.AssignRoleAsync(dto);
        // Cập nhật lại thông tin user (FullName, Email)
        var updateUser = await _svc.UpdateByIdAsync(dto.UserId, new UpdateUserAdminDto(dto.FullName, dto.Email));
        return Ok();
    }
}

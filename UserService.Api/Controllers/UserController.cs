    using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Application.Services.Interfaces;

namespace UserService.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/user")]
public class UsersController : ControllerBase
{
    private readonly IUserService _svc;
    public UsersController(IUserService svc) => _svc = svc;

    [Authorize(Roles = "Admin,Manager"), HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int size = 20)
        => Ok(await _svc.GetAllAsync(page, size));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _svc.GetByIdAsync(id));

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(UpdateProfileDto dto)
    {
        var sub = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value ?? User.Identity?.Name!;
        var id = int.Parse(sub);
        return Ok(await _svc.UpdateProfileAsync(id, dto));
    }

    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole(AssignRoleDto dto)
        => Ok(await _svc.AssignRoleAsync(dto));
}

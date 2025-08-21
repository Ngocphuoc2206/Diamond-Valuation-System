using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ContentKnowledgeService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    public AuthController(IConfiguration config) => _config = config;

    public record LoginRequest(string Username, string Password, string Role);

    /// <summary>
    /// Demo endpoint to generate JWT tokens for testing.
    /// Roles: Guest, Customer, ConsultingStaff, ValuationStaff, Manager, Admin
    /// </summary>
    [HttpPost("token")]
    [AllowAnonymous]
    public IActionResult Token([FromBody] LoginRequest req)
    {
        // Demo purpose only – accept any username/password and role from allowed list
        var allowed = new[] { "Guest", "Customer", "ConsultingStaff", "ValuationStaff", "Manager", "Admin" };
        if (string.IsNullOrWhiteSpace(req.Role) || !allowed.Contains(req.Role))
            return BadRequest("Invalid role");

        var jwtSection = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, req.Username ?? "user"),
            new Claim(ClaimTypes.Name, req.Username ?? "user"),
            new Claim(ClaimTypes.Role, req.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSection["ExpiresMinutes"] ?? "180")),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(new { access_token = jwt, role = req.Role });
    }
}

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace UserService.Api.Controllers
{
    /// <summary>
    /// Auth endpoints (demo).
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Đăng nhập demo (username=admin, password=123).
        /// </summary>
        /// <param name="req">Thông tin đăng nhập</param>
        /// <returns>JWT token</returns>
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            // DEMO: hardcode check
            if (req.Username != "admin" || req.Password != "123")
                return Unauthorized(new { message = "Sai username hoặc password" });

            // Sinh JWT
            var jwtKey = _config["JWT:Key"] ?? "super_secret_dev_key_123";
            var jwtIssuer = _config["JWT:Issuer"] ?? "dvs";
            var jwtAudience = _config["JWT:Audience"] ?? "dvs";

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, req.Username),
                new Claim(ClaimTypes.Role, "Admin"), // role giả lập
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                success = true,
                token = accessToken,
                expiresIn = 1800,
                tokenType = "Bearer"
            });
        }

        /// <summary>
        /// Endpoint test cần JWT.
        /// </summary>
        [HttpGet("me")]
        [Authorize] // yêu cầu JWT
        public IActionResult Me()
        {
            var userName = User.Identity?.Name ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            return Ok(new { username = userName, role });
        }
    }

    public record LoginRequest(string Username, string Password);
}

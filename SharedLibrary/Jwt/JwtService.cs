using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SharedLibrary.Jwt;

public interface IJwtService
{
    string GenerateToken(string subject, IEnumerable<Claim>? extraClaims = null);
}

public class JwtService : IJwtService
{
    private readonly JwtOptions _opt;
    public JwtService(JwtOptions opt) => _opt = opt;

    public string GenerateToken(string subject, IEnumerable<Claim>? extraClaims = null)
    {
        var claims = new List<Claim> { new(JwtRegisteredClaimNames.Sub, subject) };
        if (extraClaims != null) claims.AddRange(extraClaims);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _opt.Issuer,
            audience: _opt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_opt.ExpireMinutes),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
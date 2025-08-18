using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SharedLibrary.Jwt
{
    public class JwtService : IJwtService
    {
        private readonly JwtOptions _options;
        public JwtService(JwtOptions options)
        {
            _options = options;
        }
        //Tạo JWT token cho người dùng dựa trên userId và role
        public string GenerateToken(int userId, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            // Tạo đối tượng SecurityTokenDescriptor để mô tả token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                 issuer: _options.Issuer,
                 audience: _options.Audience,
                 claims: claims,
                 expires: DateTime.UtcNow.AddMinutes(_options.ExpiryMinutes),
                 signingCredentials: creds
            );
            // Chuyển đổi token thành chuỗi JWT
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

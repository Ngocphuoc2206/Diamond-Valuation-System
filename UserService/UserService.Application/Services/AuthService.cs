using SharedLibrary.Jwt;
using SharedLibrary.Response;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using UserService.Application.DTOs;
using UserService.Application.Interfaces;
using UserService.Application.Services.Interfaces;
using UserService.Domain.Entities;
using UserService.Domain.Interfaces;

namespace UserService.Application.Services
{
    public class AuthService: IAuthService
    {
        private readonly IUnitOfWork _uow;
        private readonly IPasswordHasher _hasher;
        private readonly IJwtService _jwt;
        public AuthService(IUnitOfWork unitOfWork, IPasswordHasher hasher, IJwtService jwtService)
        {
            _uow = unitOfWork;
            _hasher = hasher;
            _jwt = jwtService;
        }

        public async Task<ApiResponse<TokenResponse>> RegisterAsync(RegisterDto dto)
        {
            var exists_User = await _uow.UserRepository.GetByAsync(u => u.UserName == dto.UserName);
            if (exists_User != null) return ApiResponse<TokenResponse>.Failure("User already exists");
            
            // Create new user entity
            var (hash, salt) = _hasher.Hash(dto.Password);
            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FullName = dto.FullName,
                PasswordHash = hash,
                PasswordSalt = salt
            };
            await _uow.UserRepository.CreateAsync(user);

            //Check role from dto
            var role = new Role();
            if (dto.role is null)
            {
                // Default Role = Customer
                role = await _uow.RoleRepository.GetByAsync(r => r.Name == "Customer")
                   ?? (await _uow.RoleRepository.CreateAsync(new Role { Name = "Customer" })).Data!;
            }
            else role = await _uow.RoleRepository.GetByAsync(r => r.Name == dto.role)
                   ?? (await _uow.RoleRepository.CreateAsync(new Role { Name = dto.role })).Data!;
            // GÁN role Customer cho user mới
            await _uow.UserRoleRepository.CreateAsync(new UserRole { UserId = user.Id, RoleId = role.Id });
            return await IssueTokensAsync(user, "register");
        }

        public async Task<ApiResponse<TokenResponse>> LoginAsync(LoginDto dto, string? ip = null, string? ua = null)
        {
            // Check if user exists
            var user = await _uow.UserRepository.GetByAsync(u => u.UserName == dto.UserNameOrEmail || u.Email == dto.UserNameOrEmail);
            if (user == null) return ApiResponse<TokenResponse>.Failure("Invalid username or password");
            // Verify password
            if (!_hasher.Verify(dto.Password, user.PasswordHash, user.PasswordSalt))
                return ApiResponse<TokenResponse>.Failure("Invalid username or password");
            return await IssueTokensAsync(user, "login", ip, ua);
        }

        public async Task<ApiResponse<TokenResponse>> RefreshAsync(TokenRefreshDto dto, string? ip = null, string? ua = null)
        {
            // Validate refresh token
            var token = await _uow.RefreshTokenRepository.GetByAsync(t => t.Token == dto.RefreshToken && t.RevokedAt == null);
            if (token == null || token.ExpiresAt < DateTime.UtcNow) return ApiResponse<TokenResponse>.Failure("Invalid or expired refresh token");
            // Get user
            var user = await _uow.UserRepository.GetByIdAsync(token.UserId);
            if (user == null) return ApiResponse<TokenResponse>.Failure("User not found");
            // Revoke old token
            token.RevokedAt = DateTime.UtcNow;
            await _uow.RefreshTokenRepository.UpdateAsync(token);
            // Issue new tokens
            return await IssueTokensAsync(user, "refresh", ip, ua);
        }


        public async Task<ApiResponse<bool>> LogoutAsync(LogoutDto dto)
        {
            if (!string.IsNullOrEmpty(dto.RefreshToken))
            {
                var rt = await _uow.RefreshTokenRepository.GetByAsync(x => x.Token == dto.RefreshToken && x.RevokedAt == null);
                if (rt is not null) { rt.RevokedAt = DateTime.UtcNow; await _uow.RefreshTokenRepository.UpdateAsync(rt); }
            }
            return ApiResponse<bool>.CreateSuccessResponse(true, "Logged out");
        }

        // Create a new user session
        private async Task<ApiResponse<TokenResponse>> IssueTokensAsync(User user, string reason, string? ip = null, string? ua = null)
        {
            // roles
            var roles = (await _uow.UserRoleRepository.GetManyAsync(x => x.UserId == user.Id))
                .Select(ur => ur.RoleId).ToList();
            var roleNames = new List<string>();
            foreach (var rid in roles)
            {
                var r = await _uow.RoleRepository.GetByIdAsync(rid);
                if (r != null) roleNames.Add(r.Name);
            }

            var claims = new List<Claim>{
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new("uid", user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Email, user.Email ?? "")
        };
            claims.AddRange(roleNames.Select(r => new Claim(ClaimTypes.Role, r)));

            var access = _jwt.GenerateToken(claims);

            // create refresh token
            var refresh = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            await _uow.RefreshTokenRepository.CreateAsync(new RefreshToken
            {
                UserId = user.Id,
                Token = refresh,
                ExpiresAt = DateTime.UtcNow.AddDays(14),
                DeviceInfo = ua,
                IpAddress = ip
            });

            var resp = new TokenResponse(access, refresh, DateTime.UtcNow.AddMinutes(20));
            return ApiResponse<TokenResponse>.CreateSuccessResponse(resp, $"Token issued ({reason})");
        }

        public async Task<ApiResponse<IEnumerable<SessionDto>>> GetSessionsAsync(int userId)
        {
            var now = DateTime.UtcNow;
            var tokens = await _uow.RefreshTokenRepository
                                   .GetManyAsync(x => x.UserId == userId);
            var dtos = tokens
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new SessionDto(
                    t.Id,
                    t.DeviceInfo,
                    t.IpAddress,
                    t.ExpiresAt,
                    t.RevokedAt != null || t.ExpiresAt <= now,
                    (DateTime)t.CreatedAt
                ));
            return ApiResponse<IEnumerable<SessionDto>>.CreateSuccessResponse(dtos, "Fetched sessions");
        }

        public async Task<ApiResponse<bool>> RevokeSessionAsync(int userId, int refreshTokenId)
        {
            var rt = await _uow.RefreshTokenRepository
                               .GetByAsync(x => x.Id == refreshTokenId && x.UserId == userId);
            if (rt is null)
                return ApiResponse<bool>.Failure("Session not found");

            if (rt.RevokedAt == null)
            {
                rt.RevokedAt = DateTime.UtcNow;
                await _uow.RefreshTokenRepository.UpdateAsync(rt);
            }

            return ApiResponse<bool>.CreateSuccessResponse(true, "Revoked session");
        }

        public async Task<ApiResponse<bool>> RevokeAllSessionsAsync(int userId)
        {
            var tokens = await _uow.RefreshTokenRepository
                                   .GetManyAsync(x => x.UserId == userId && x.RevokedAt == null);
            foreach (var t in tokens)
            {
                t.RevokedAt = DateTime.UtcNow;
                await _uow.RefreshTokenRepository.UpdateAsync(t);
            }
            return ApiResponse<bool>.CreateSuccessResponse(true, "Revoked all sessions");
        }
    }
}

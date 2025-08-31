namespace SharedLibrary.Jwt;
public class JwtService : IJwtService { public string CreateToken(Guid userId, string role) => $"FAKE.{userId}.{role}"; }

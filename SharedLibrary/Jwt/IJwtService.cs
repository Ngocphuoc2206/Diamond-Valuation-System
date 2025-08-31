namespace SharedLibrary.Jwt;
public interface IJwtService { string CreateToken(Guid userId, string role); }

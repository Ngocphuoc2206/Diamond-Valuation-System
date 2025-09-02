namespace UserService.Application.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }

    public string Status { get; set; } = "active"; // active/suspended
    public DateTime? CreatedAt { get; set; }
    public DateTime? LastActiveAt { get; set; }
    public string? AvatarUrl { get; set; }

    public List<RoleDto> Roles { get; set; } = new();
}

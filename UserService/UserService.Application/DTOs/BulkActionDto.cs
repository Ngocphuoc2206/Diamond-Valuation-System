namespace UserService.Application.DTOs;

public class BulkActionDto
{
    public string Action { get; set; } = string.Empty; // "activate" | "suspend" | "delete"
    public IEnumerable<int> UserIds { get; set; } = new List<int>();
}

namespace Diamond.ValuationService.Domain.Entities;

public class Contact
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string PreferredMethod { get; set; } = null!; // Email | Phone | Zalo | ...
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ValuationCase> Cases { get; set; } = new List<ValuationCase>();
}

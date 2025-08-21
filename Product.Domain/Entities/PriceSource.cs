namespace Product.Domain.Entities;

public class PriceSource
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!; // Rapaport, BlueNile, etc.
    public string? Endpoint { get; set; }
    public bool IsEnabled { get; set; } = true;
    public ICollection<PriceSnapshot> Snapshots { get; set; } = new List<PriceSnapshot>();
}

public class PriceSnapshot
{
    public Guid Id { get; set; }
    public Guid PriceSourceId { get; set; }
    public PriceSource? PriceSource { get; set; }
    public DateTime CapturedAt { get; set; } = DateTime.UtcNow;
    public string Payload { get; set; } = default!; // JSON for raw price tables
}

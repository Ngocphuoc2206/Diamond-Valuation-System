namespace CommerceCoreService.Api.Controllers;

public class Transaction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string DiamondId { get; set; }
    public double Amount { get; set; }
    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } // Pending, Completed, Failed
}
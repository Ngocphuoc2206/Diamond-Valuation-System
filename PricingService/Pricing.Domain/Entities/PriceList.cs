using SharedKernel.Entites;

namespace Pricing.Domain.Entities;

public class PriceList : BaseEntity
{
    public string Code { get; set; } = "DEFAULT"; // unique
    public string Name { get; set; } = "Default";
    public bool IsActive { get; set; } = true;
    public ICollection<Price> Prices { get; set; } = new List<Price>();
}

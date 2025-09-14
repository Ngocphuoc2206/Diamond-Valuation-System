using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Application.DTOs
{
    public record CartItemDto
    {
        public int Id { get; init; }
        public string Sku { get; init; } = default!;
        public int Quantity { get; init; }
        public decimal UnitPrice { get; init; }
        public decimal LineTotal { get; init; }
        public string? Name { get; init; }
        public string? ImageUrl { get; init; }
    }
}

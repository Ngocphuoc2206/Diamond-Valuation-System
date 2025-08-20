using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Domain.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string Category { get; set; } = default!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Status { get; set; } = default!;
        public string Image { get; set; } = default!;
    }
}

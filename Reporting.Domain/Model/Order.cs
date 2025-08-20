using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Domain.Model
{
    public class Order
    {
        public string Id { get; set; } = default!;
        public string Customer { get; set; } = default!;
        public int Items { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = default!;
        public DateTime Date { get; set; }
        public string Email { get; set; } = default!;
    }
}

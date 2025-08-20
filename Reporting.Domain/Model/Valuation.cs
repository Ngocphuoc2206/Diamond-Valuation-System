using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Domain.Model
{
    public class Valuation
    {
        public int Id { get; set; }
        public string Customer { get; set; } = default!;
        public string Type { get; set; } = default!;
        public string Status { get; set; } = default!;
        public string AssignedTo { get; set; } = default!;
        public DateTime DueDate { get; set; }
        public string Priority { get; set; } = default!;
    }
}

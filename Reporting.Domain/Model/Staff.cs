using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Domain.Model
{
    public class Staff
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string Department { get; set; } = default!;
        public int ActiveCases { get; set; }
        public double Performance { get; set; }
        public string Status { get; set; } = default!;
        public string Avatar { get; set; } = default!;
    }
}

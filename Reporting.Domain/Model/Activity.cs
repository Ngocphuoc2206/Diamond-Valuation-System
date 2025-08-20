using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Domain.Model
{
    public class Activity
    {
        public int Id { get; set; }
        public string Type { get; set; } = default!;
        public string Message { get; set; } = default!;
        public string Time { get; set; } = default!;
        public string Priority { get; set; } = default!;
    }
}

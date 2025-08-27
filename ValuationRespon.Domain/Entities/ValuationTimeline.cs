using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Domain.Entities
{
    public class ValuationTimeline
    {
        public Guid Id { get; set; }
        public Guid ValuationCaseId { get; set; }
        public string Step { get; set; }   // Contacted, Scheduled, Valuation
        public string Note { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

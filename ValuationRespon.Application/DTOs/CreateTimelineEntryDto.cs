using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Application.DTOs
{
    public class CreateTimelineEntryDto
    {
        public string Step { get; set; } = default!;   // ví dụ: Contacted, Scheduled, Valuation, ResultPrepared, SentToCustomer...
        public string? Note { get; set; }
        public DateTime? Timestamp { get; set; } // optional; nếu null BE tự dùng UTC now
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Application.DTOs
{
    public class ValuationTimelineViewDto
    {
        public Guid Id { get; set; }
        public Guid ValuationCaseId { get; set; }
        public string Step { get; set; } = default!;
        public string Note { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}

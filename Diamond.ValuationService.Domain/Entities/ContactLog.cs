using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Domain.Entities
{
    public class ContactLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CaseId { get; set; }
        public ValuationCase Case { get; set; } = default!;
        public string Channel { get; set; } = "phone"; // phone/email/zalo/other
        public string Outcome { get; set; } = "reached";
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? NextFollowUpAt { get; set; }
        public int? CreatedBy { get; set; } // uid staff
    }

}

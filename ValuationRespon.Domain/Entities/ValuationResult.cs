using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Domain.Entities
{
    public class ValuationResult
    {
        public Guid Id { get; set; }
        public Guid ValuationCaseId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MarketValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal InsuranceValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal RetailValue { get; set; }
        public string Condition { get; set; }
        public string Certification { get; set; }
        public string? Notes { get; set; } = null;
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}

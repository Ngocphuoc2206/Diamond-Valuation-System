using System;
using System.ComponentModel.DataAnnotations.Schema;

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

        public string Condition { get; set; } = string.Empty;
        public string Certification { get; set; } = string.Empty;
        public string? Notes { get; set; } = null;

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

        // Quan hệ với Case
        public ValuationCase? Case { get; set; }
    }
}

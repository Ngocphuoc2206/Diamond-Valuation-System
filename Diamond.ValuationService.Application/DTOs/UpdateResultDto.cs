using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public class UpdateResultDto
    {
        public decimal PricePerCarat { get; set; }
        public decimal TotalPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public string AlgorithmVersion { get; set; } = "1.0.0";
        public DateTime ValuatedAt { get; set; } = DateTime.UtcNow;
    }
}

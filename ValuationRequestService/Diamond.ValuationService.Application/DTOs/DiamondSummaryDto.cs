using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public sealed class DiamondSummaryDto
    {
        public string? Type { get; set; }   // hoặc Origin
        public string? Shape { get; set; }
        public decimal? Carat { get; set; }
        public string? Color { get; set; }
        public string? Clarity { get; set; }
        public string? Cut { get; set; }
    }
}

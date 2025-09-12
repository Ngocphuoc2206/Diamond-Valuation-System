using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Domain.Entities
{
    public class ValuationSpec
    {
        public string Origin { get; set; } = default!;
        public string Shape { get; set; } = default!;
        public decimal Carat { get; set; }
        public string Color { get; set; } = default!;
        public string Clarity { get; set; } = default!;
        public string Cut { get; set; } = default!;
        public string? Polish { get; set; }
        public string? Symmetry { get; set; }
        public string? Fluorescence { get; set; }
        public decimal? TablePercent { get; set; }
        public decimal? DepthPercent { get; set; }
        public string? Measurements { get; set; }
    }
}

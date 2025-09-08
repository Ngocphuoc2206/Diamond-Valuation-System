using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public class DiamondInfoDto
    {
        public string? CertificateNo { get; set; }
        public string Origin { get; set; } = default!;
        public string Shape { get; set; } = default!;
        public decimal Carat { get; set; }
        public string Color { get; set; } = default!;
        public string Clarity { get; set; } = default!;
        public string Cut { get; set; } = default!;
        public string Polish { get; set; } = default!;
        public string Symmetry { get; set; } = default!;
        public string Fluorescence { get; set; } = default!;
    }
}

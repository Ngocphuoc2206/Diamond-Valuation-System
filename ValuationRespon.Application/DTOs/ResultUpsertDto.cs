using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Application.DTOs
{
    public class ResultUpsertDto
    {
        public Guid CaseId { get; set; }            // Liên kết tới Case ở RequestService
        public Guid? RequestId { get; set; }        // nếu có
        public string? CertificateNo { get; set; }

        public decimal PricePerCarat { get; set; }
        public decimal TotalPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public string AlgorithmVersion { get; set; } = "1.0.0";
        public DateTime ValuatedAt { get; set; } = DateTime.UtcNow;

        public string? CustomerName { get; set; }   // thông tin hiển thị
    }
}

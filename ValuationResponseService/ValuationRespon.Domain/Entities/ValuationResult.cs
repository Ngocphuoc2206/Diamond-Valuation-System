using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValuationRespon.Domain.Entities
{
    public class ValuationResult
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Liên kết để truy vết
        [Required]
        public Guid CaseId { get; set; }             // Id của case bên RequestService

        public Guid? RequestId { get; set; }         // Id ValuationRequest (nếu có)

        [MaxLength(100)]
        public string? CertificateNo { get; set; }

        // Kết quả tính giá
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerCarat { get; set; }   // <- bổ sung

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        [MaxLength(10)]
        public string Currency { get; set; } = "USD";

        public string? BreakdownJson { get; set; }   // JSON chi tiết (tùy chọn)

        [MaxLength(200)]
        public string? CustomerName { get; set; }    // <- bổ sung: hiển thị

        [MaxLength(32)]
        public string AlgorithmVersion { get; set; } = "1.0.0";  // <- bổ sung

        public DateTime ValuatedAt { get; set; } = DateTime.UtcNow; // <- bổ sung

        // Ai là người định giá (để hiển thị lịch sử)
        public int? ValuationId { get; set; }

        [MaxLength(200)]
        public string? ValuationName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

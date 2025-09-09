using System;

namespace ValuationRespon.Domain.Entities
{
    public class ValuationCase
    {
        public Guid Id { get; set; }

        // Thông tin khách hàng
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        // Thông tin kim cương
        public string CertificateNo { get; set; }
        public string Origin { get; set; }
        public string Shape { get; set; }
        public double Carat { get; set; }
        public string Color { get; set; }
        public string Clarity { get; set; }
        public string Cut { get; set; }
        public string Polish { get; set; }
        public string Symmetry { get; set; }
        public string Fluorescence { get; set; }

        // Thời gian
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Trạng thái xử lý
        public string Status { get; set; } = "Pending"; // Pending → InProgress → Completed

        // Người được phân công xử lý (Consultant/Valuator)
        public Guid? AssigneeId { get; set; } // Khóa ngoại sang User
        public string? AssigneeName { get; set; } // Hiển thị FE

        public ValuationResult? Result { get; set; }
        public ICollection<ValuationTimeline> Timelines { get; set; } = new List<ValuationTimeline>();
    }
}

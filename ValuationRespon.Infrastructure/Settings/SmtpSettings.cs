using System.ComponentModel.DataAnnotations;

namespace ValuationRespon.Infrastructure.Settings
{
    public sealed class SmtpSettings
    {
        [Required]
        public string? Host { get; set; }

        [Range(1, 65535)]
        public int Port { get; set; } = 587;

        public string? User { get; set; }
        public string? Password { get; set; }

        // Bạn đang dùng chuỗi "Display Name <email@...>"
        // vẫn ok nếu dùng MailboxAddress.Parse cho FROM.
        [Required]
        public string From { get; set; } = "Diamond Valuations <no-reply@diamond.local>";

        // Tùy chọn: nếu muốn map kiểu SSL
        public bool UseSsl { get; set; } = false; // 587 → StartTLS (không phải SSL on connect)
    }
}

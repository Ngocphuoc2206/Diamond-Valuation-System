namespace Notification.Domain.Entities
{
    public class NotificationLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Type { get; set; } = ""; // Email hoặc SMS
        public string Recipient { get; set; } = "";
        public string Message { get; set; } = "";
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool Success { get; set; } = true;
    }
}

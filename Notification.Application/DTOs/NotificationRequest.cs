namespace Notification.Application.DTOs
{
    public class NotificationRequest
    {
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string ValuationResult { get; set; } = string.Empty;
    }
}

namespace Notification.Application.Services;

public interface INotificationHandler
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendSmsAsync(string phoneNumber, string message);
}

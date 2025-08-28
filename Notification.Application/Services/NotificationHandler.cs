using Notification.Application.Services;

namespace Notification.Infrastructure.Services;

public class NotificationHandler : INotificationHandler
{
    public Task SendEmailAsync(string to, string subject, string body)
    {
        // Fake: sau này có thể tích hợp SMTP
        Console.WriteLine($"[EMAIL] To={to}, Subject={subject}, Body={body}");
        return Task.CompletedTask;
    }

    public Task SendSmsAsync(string phoneNumber, string message)
    {
        // Fake: sau này có thể tích hợp Twilio
        Console.WriteLine($"[SMS] To={phoneNumber}, Message={message}");
        return Task.CompletedTask;
    }
}

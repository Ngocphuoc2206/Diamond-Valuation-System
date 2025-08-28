namespace Notification.Application.Services;

public interface ISmsService
{
    Task SendSmsAsync(string phoneNumber, string message);
}

using Notification.Application.DTOs;

namespace Notification.Application.Interfaces
{
    public interface INotificationService
    {
        Task SendAsync(NotificationRequest request);
    }
}

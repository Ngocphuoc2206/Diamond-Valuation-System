using Microsoft.AspNetCore.Mvc;
using Notification.Application.Services;

namespace Notification.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationHandler _notificationHandler;

    public NotificationController(INotificationHandler notificationHandler)
    {
        _notificationHandler = notificationHandler;
    }

    [HttpPost("email")]
    public async Task<IActionResult> SendEmail(string to, string subject, string body)
    {
        await _notificationHandler.SendEmailAsync(to, subject, body);
        return Ok("Email sent");
    }

    [HttpPost("sms")]
    public async Task<IActionResult> SendSms(string phoneNumber, string message)
    {
        await _notificationHandler.SendSmsAsync(phoneNumber, message);
        return Ok("SMS sent");
    }
}

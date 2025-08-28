using Microsoft.Extensions.Configuration;
using Notification.Application.Services;

namespace Notification.Infrastructure.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public Task SendEmailAsync(string to, string subject, string body)
    {
        // Fake: log ra console
        Console.WriteLine($"[EMAIL] To={to}, Subject={subject}, Body={body}");
        return Task.CompletedTask;
    }
}

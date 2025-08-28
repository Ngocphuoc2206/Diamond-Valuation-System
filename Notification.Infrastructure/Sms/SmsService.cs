using Microsoft.Extensions.Configuration;
using Notification.Application.Services;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Notification.Infrastructure.Sms;

public class SmsService : ISmsService
{
    private readonly IConfiguration _config;

    public SmsService(IConfiguration config)
    {
        _config = config;
        var accountSid = _config["Twilio:AccountSid"];
        var authToken = _config["Twilio:AuthToken"];
        TwilioClient.Init(accountSid, authToken);
    }

    public Task SendSmsAsync(string phoneNumber, string message)
    {
        // Fake send (sau có thể call Twilio)
        Console.WriteLine($"[SMS] To={phoneNumber}, Message={message}");
        return Task.CompletedTask;
    }
}

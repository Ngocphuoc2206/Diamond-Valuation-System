using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using ValuationRespon.Application.Interfaces;

namespace ValuationRespon.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("no-reply@diamond.com"));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart("html") { Text = body };

            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("your-email@gmail.com", "app-password");
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}

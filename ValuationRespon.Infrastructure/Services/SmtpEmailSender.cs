using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Infrastructure.Settings;

public sealed class SmtpEmailSender : IEmailService
{
    private readonly SmtpSettings _cfg;
    public SmtpEmailSender(IOptions<SmtpSettings> cfg) => _cfg = cfg.Value;

    // Gợi ý chữ ký nhận name/email tách bạch
    public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default, string? toName = null)
    {
        if (string.IsNullOrWhiteSpace(_cfg.Host))
            throw new InvalidOperationException("SMTP Host is not configured (Smtp:Host).");
        if (_cfg.Port <= 0)
            throw new InvalidOperationException("SMTP Port is not configured (Smtp:Port).");

        if (string.IsNullOrWhiteSpace(toEmail) || !toEmail.Contains("@"))
            throw new ArgumentException("Invalid recipient email.", nameof(toEmail));

        var msg = new MimeMessage();

        // From: chỉnh tùy config bạn đang dùng
        msg.From.Add(MailboxAddress.Parse(_cfg.From)); // nếu From là "Display <email@...>"
        msg.To.Add(new MailboxAddress(toName ?? string.Empty, toEmail));

        msg.Subject = subject ?? string.Empty;
        msg.Body = new BodyBuilder { HtmlBody = htmlBody ?? string.Empty }.ToMessageBody();

        // Chọn cơ chế TLS đúng
        var socketOpt = SecureSocketOptions.Auto;
        if (_cfg.Port == 587) socketOpt = SecureSocketOptions.StartTls;
        if (_cfg.Port == 465) socketOpt = SecureSocketOptions.SslOnConnect;
        if (_cfg.UseSsl && _cfg.Port == 587) socketOpt = SecureSocketOptions.StartTls; // tương thích field UseSsl

        using var client = new SmtpClient();
        await client.ConnectAsync(_cfg.Host, _cfg.Port, socketOpt, ct);

        if (!string.IsNullOrEmpty(_cfg.User))
            await client.AuthenticateAsync(_cfg.User, _cfg.Password, ct);

        await client.SendAsync(msg, ct);
        await client.DisconnectAsync(true, ct);
    }
}

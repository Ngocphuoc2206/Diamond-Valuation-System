namespace ValuationRespon.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(
                    string toEmail,
                    string subject,
                    string htmlBody,
                    CancellationToken ct = default,
                    string? toName = null
                );
    }
}

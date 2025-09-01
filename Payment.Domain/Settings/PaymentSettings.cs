namespace Payment.Domain.Settings;

public sealed class PaymentSettings
{
    public string BaseUrl { get; set; } = "";       // http://localhost:9001
    public string PublicBaseUrl { get; set; } = ""; // nếu chạy sau reverse proxy
}

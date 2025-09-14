using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Payment.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Payment.Application.Services
{
    public class HttpOrderNotifier : IOrderNotifier
    {
        private readonly HttpClient _http;
        private readonly string _base;
        private readonly string _secret;
        private readonly ILogger<HttpOrderNotifier> _log;

        public HttpOrderNotifier(HttpClient http, IConfiguration cfg, ILogger<HttpOrderNotifier> log)
        {
            _http = http;
            _base = cfg["Integrations:Order:BaseUrl"] ?? "http://localhost:9000";
            _secret = cfg["Integrations:Order:Secret"] ?? "change-me";
            _log = log;
        }

        public async Task NotifyAsync(string orderCode, string status, string? providerRef = null)
        {
            var ts = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
            var payload = $"{orderCode}|{status}|{ts}";
            using var h = new HMACSHA256(Encoding.UTF8.GetBytes(_secret));
            var sig = Convert.ToHexString(h.ComputeHash(Encoding.UTF8.GetBytes(payload)));

            var body = new { OrderCode = orderCode, Status = status, ProviderRef = providerRef };
            var req = new HttpRequestMessage(HttpMethod.Post, $"{_base}/api/orders/payment/callback")
            {
                Content = JsonContent.Create(body)
            };
            req.Headers.Add("X-Timestamp", ts);
            req.Headers.Add("X-Signature", sig);

            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode)
            {
                var txt = await res.Content.ReadAsStringAsync();
                _log.LogError("Order callback failed: {Status} {Body}", res.StatusCode, txt);
            }
        }
    }
}

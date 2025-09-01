using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payment.Application.DTOs;
using Payment.Application.Services;
using Payment.Domain.Services.Interfaces;

namespace Payment.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _svc;
    public PaymentsController(IPaymentService svc) => _svc = svc;

    /// Tạo payment intent + redirectUrl
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto, [FromQuery] string? returnUrl = null)
    {
        var idem = Request.Headers["Idempotency-Key"].FirstOrDefault() ?? string.Empty;
        dto = dto with { ReturnUrl = dto.ReturnUrl ?? returnUrl };
        var res = await _svc.CreateAsync(dto, idem);
        return Ok(res);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id) => Ok(await _svc.GetAsync(id));

    /// Simulate nhanh (khỏi vào trang gateway)
    [AllowAnonymous]
    [HttpPost("{id:int}/simulate")]
    public async Task<IActionResult> Simulate(int id, [FromQuery] string result = "success", [FromQuery] string? reason = null)
        => Ok(await _svc.SimulateAsync(id, result, reason));

    /// Webhook “giả” (gateway gọi về)
    [AllowAnonymous]
    [HttpPost("fake/webhook")]
    public async Task<IActionResult> FakeWebhook([FromBody] FakeWebhookDto dto)
        => Ok(await _svc.HandleFakeWebhookAsync(dto));

    /// ⭐ Trang “cổng thanh toán giả” ngay trên API — người dùng chọn Success/Fail/Cancel
    /// GET /api/payments/fake/pay?pid=123&ref=FAKE-..&return=http%3A%2F%2Flocalhost%3A5173%2Fpayment%2Freturn
    [AllowAnonymous]
    [HttpGet("fake/pay")]
    public ContentResult FakePay([FromQuery] int pid, [FromQuery] string? @ref, [FromQuery] string? @return)
    {
        var webhookUrl = $"{Request.Scheme}://{Request.Host}/api/payments/fake/webhook";
        var ret = System.Net.WebUtility.UrlEncode(@return ?? "");

        var html = $@"<!doctype html><html><head>
                        <meta charset='utf-8'/><title>Fake Gateway</title>
                        <style>body{{font-family:system-ui,Segoe UI,Roboto,Arial;margin:40px}}button{{padding:10px 16px;margin-right:8px}}</style>
                        </head><body>
                        <h2>Fake Payment Gateway</h2>
                        <p>Payment Id: <b>{pid}</b></p>
                        <p>Reference: <b>{@ref}</b></p>
                        <div>
                          <button onclick='pay(""payment.succeeded"")'>Success</button>
                          <button onclick='pay(""payment.canceled"")'>Cancel</button>
                          <button onclick='pay(""payment.failed"")'>Fail</button>
                        </div>
                        <script>
                        async function pay(evt) {{
                          const res = await fetch(""{webhookUrl}"", {{
                            method: ""POST"",
                            headers: {{ ""Content-Type"": ""application/json"" }},
                            body: JSON.stringify({{ provider: ""FAKE"", providerReference: ""{@ref}"", event: evt }})
                          }});
                          if ({(string.IsNullOrWhiteSpace(ret) ? "true" : "false")}) {{
                            document.body.innerHTML += ""<p>Webhook sent. You may close this tab.</p>"";
                          }} else {{
                            window.location.href = decodeURIComponent(""{ret}"");
                          }}
                        }}
                        </script>
                        </body>
                        </html>";
        return new ContentResult { Content = html, ContentType = "text/html" };
    }
}

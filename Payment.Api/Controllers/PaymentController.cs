using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payment.Application.DTOs;
using Payment.Domain.Services.Interfaces;

namespace Payment.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _svc;
    public PaymentsController(IPaymentService svc) => _svc = svc;

    [HttpPost] // tạo payment intent
    public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
    {
        var idem = Request.Headers["Idempotency-Key"].FirstOrDefault() ?? string.Empty;
        var res = await _svc.CreateAsync(dto, idem);
        return Ok(res);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
        => Ok(await _svc.GetAsync(id));

    // Giả lập webhook từ FAKE provider
    [AllowAnonymous, HttpPost("fake/webhook")]
    public async Task<IActionResult> FakeWebhook([FromBody] FakeWebhookDto dto)
    {
        using var reader = new StreamReader(Request.Body);
        Request.Body.Position = 0;
        var raw = await reader.ReadToEndAsync();
        var res = await _svc.HandleFakeWebhookAsync(dto, raw);
        return Ok(res);
    }
    [HttpPost("{id:int}/simulate")]
    public async Task<IActionResult> Simulate(int id, [FromQuery] string result = "success", [FromQuery] string? reason = null)
        => Ok(await _svc.SimulateAsync(id, result, reason));
}

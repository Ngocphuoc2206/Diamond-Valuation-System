using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Order.Application.DTOs;
using Order.Application.Services.Interfaces;
using Order.Domain.Enums;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Order.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _svc;
    public OrdersController(IOrderService svc) { _svc = svc; }

    private int? GetUserId()
    {
        // ưu tiên "uid", fallback "sub"
        var sub = User.Claims.FirstOrDefault(c => c.Type == "uid" || c.Type == ClaimTypes.NameIdentifier || c.Type == "sub")?.Value;
        return int.TryParse(sub, out var id) ? id : null;
    }

    private static readonly string[] CustomerRoles = { "Customer", "User" };

    private bool IsCustomer() =>
        CustomerRoles.Any(r =>
            User.IsInRole(r) ||
            User.Claims.Any(c => c.Type == ClaimTypes.Role &&
                                 c.Value.Equals(r, StringComparison.OrdinalIgnoreCase)));



    /// <summary>
    /// Checkout:
    /// - Customer: bắt buộc có CartKey (cart session).
    /// - Non-customer (Admin/Staff...): bỏ qua CartKey, dùng CustomerId (userId).
    /// </summary>
    [Authorize]
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutDto dto)
    {
        var isCustomer = IsCustomer();
        var userId = GetUserId();
        if (isCustomer) 
        { 
            if (string.IsNullOrWhiteSpace(dto.CartKey))
                return BadRequest("CartKey is required for Customer.");
            dto = dto with { CustomerId = userId };
        }
        else
        {
            var resolvedCustomerId = dto.CustomerId ?? userId;
            if (resolvedCustomerId == null || resolvedCustomerId <= 0)
                return BadRequest("CustomerId is required for non-Customer users.");
            dto = dto with { CustomerId = resolvedCustomerId, CartKey = null }; // gán CustomerId từ token
        }
        var result = await _svc.CheckoutAsync(dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize, HttpGet("{orderNo}")]
    public async Task<IActionResult> Get(string orderNo)
        => Ok(await _svc.GetAsync(orderNo));

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] string? q,
        [FromQuery] OrderStatus? status,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var resp = await _svc.SearchAsync(new OrderSearchQueryDto(q, status, dateFrom, dateTo, page, pageSize));
        return resp.Success ? Ok(resp) : BadRequest(resp);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{orderNo}/status")]
    public async Task<IActionResult> UpdateStatus(string orderNo, [FromBody] UpdateOrderStatusDto body)
    {
        var resp = await _svc.UpdateStatusAsync(orderNo, body.Status);
        return resp.Success ? Ok(resp) : BadRequest(resp);
    }

    [AllowAnonymous] // dùng HMAC để xác thực request
    [HttpPost("payment/callback")]
    public async Task<IActionResult> PaymentCallback(
        [FromBody] PaymentCallbackDto dto,
        [FromServices] IOrderService svc,
        [FromHeader(Name = "X-Signature")] string? signature,
        [FromHeader(Name = "X-Timestamp")] string? timestamp,
        [FromServices] IConfiguration config)
    {
        // Verify HMAC
        var secret = config["Integrations:Payment:Secret"]; // cấu hình trong appsettings hoặc env
        if (string.IsNullOrWhiteSpace(secret) || string.IsNullOrWhiteSpace(signature) || string.IsNullOrWhiteSpace(timestamp))
            return Unauthorized("Missing signature");

        var payload = $"{dto.OrderCode}|{dto.Status}|{timestamp}";
        using var h = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = Convert.ToHexString(h.ComputeHash(Encoding.UTF8.GetBytes(payload)));
        if (!hash.Equals(signature, StringComparison.OrdinalIgnoreCase))
            return Unauthorized("Bad signature");

        // 2) Map status payment -> order
        OrderStatus newStatus = dto.Status.ToLower() switch
        {
            "succeeded" => OrderStatus.Paid,
            "failed" => OrderStatus.Cancelled,      // hoặc giữ Cancelled khác Failed tùy nghiệp vụ
            "canceled" => OrderStatus.Cancelled,
            _ => OrderStatus.Pending
        };

        // 3) Cập nhật
        var resp = await svc.UpdateStatusAsync(dto.OrderCode, newStatus);
        return resp.Success ? Ok(true) : BadRequest(resp.Message);
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyRecent([FromQuery] int take = 5)
    {
        var sub = User.FindFirst("uid")?.Value
                  ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        if (!int.TryParse(sub, out var userId)) return BadRequest("Invalid user id claim");

        var resp = await _svc.GetRecentMineAsync(userId, take);
        return resp.Success ? Ok(resp) : BadRequest(resp);
    }
}

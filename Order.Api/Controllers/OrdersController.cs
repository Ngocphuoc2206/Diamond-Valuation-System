using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Order.Application.DTOs;
using Order.Application.Services.Interfaces;
using System.Security.Claims;

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

    private bool IsCustomer() =>
        User.IsInRole("Customer") ||
        User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value.Equals("Customer", StringComparison.OrdinalIgnoreCase));


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
            dto = dto with { CustomerId = null }; // gán CustomerId từ token
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
}

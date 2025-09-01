using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Order.Application.DTOs;
using Order.Application.Services.Interfaces;
using System.Security.Claims;

namespace Order.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/orders/cart")]
public class CartController : ControllerBase
{
    private readonly ICartService _svc;
    public CartController(ICartService svc) { _svc = svc; }

    // Lấy userId từ claim "sub" trong token JWT
    private int? GetUserId()
    {
        var sub = User.Claims.FirstOrDefault(c => c.Type == "uid" || c.Type == "sub")?.Value;
        return int.TryParse(sub, out var id) ? id : null;
    }

    private bool IsCustomer() => User.IsInRole("Customer")
        || User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value.Equals("Customer", StringComparison.OrdinalIgnoreCase));

    [AllowAnonymous, HttpPost("create")]
    public async Task<IActionResult> Create([FromQuery] string? cartKey)
    {
        var isCustomer = IsCustomer();
        var userId = GetUserId();
        if (!isCustomer && userId is null) return Unauthorized("Login required for non-customer roles.");
        return Ok(await _svc.CreateOrGetAsync(cartKey, userId, isCustomer));
    }

    [AllowAnonymous, HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? cartKey)
        => Ok(await _svc.GetAsync(cartKey, GetUserId(), IsCustomer()));

    [AllowAnonymous, HttpPost("items")]
    public async Task<IActionResult> AddItem([FromQuery] string? cartKey, AddCartItemDto dto)
        => Ok(await _svc.AddItemAsync(cartKey, GetUserId(), IsCustomer(), dto));

    [AllowAnonymous, HttpPut("items")]
    public async Task<IActionResult> UpdateItem([FromQuery] string? cartKey, UpdateCartItemDto dto)
        => Ok(await _svc.UpdateItemAsync(cartKey, GetUserId(), IsCustomer(), dto));

    [AllowAnonymous, HttpDelete("items/{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem([FromQuery] string? cartKey, int cartItemId)
        => Ok(await _svc.RemoveItemAsync(cartKey, GetUserId(), IsCustomer(), cartItemId));
}

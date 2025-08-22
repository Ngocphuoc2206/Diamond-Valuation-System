using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Order.Application.DTOs;
using Order.Application.Services.Interfaces;

namespace Order.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/cart")]
public class CartController : ControllerBase
{
    private readonly ICartService _svc;
    public CartController(ICartService svc) { _svc = svc; }

    [AllowAnonymous, HttpPost("create")]
    public async Task<IActionResult> Create([FromQuery] string? cartKey, [FromQuery] int? customerId)
        => Ok(await _svc.CreateOrGetAsync(cartKey, customerId));

    [AllowAnonymous, HttpGet]
    public async Task<IActionResult> Get([FromQuery] string cartKey)
        => Ok(await _svc.GetAsync(cartKey));

    [AllowAnonymous, HttpPost("items")]
    public async Task<IActionResult> AddItem([FromQuery] string cartKey, AddCartItemDto dto)
        => Ok(await _svc.AddItemAsync(cartKey, dto));

    [AllowAnonymous, HttpPut("items")]
    public async Task<IActionResult> UpdateItem([FromQuery] string cartKey, UpdateCartItemDto dto)
        => Ok(await _svc.UpdateItemAsync(cartKey, dto));

    [AllowAnonymous, HttpDelete("items/{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem([FromQuery] string cartKey, int cartItemId)
        => Ok(await _svc.RemoveItemAsync(cartKey, cartItemId));
}

using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Order.Application.DTOs;
using Order.Application.Services.Interfaces;

namespace Order.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _svc;
    public OrdersController(IOrderService svc) { _svc = svc; }

    [AllowAnonymous, HttpPost("checkout")]
    public async Task<IActionResult> Checkout(CheckoutDto dto)
        => Ok(await _svc.CheckoutAsync(dto));

    [Authorize, HttpGet("{orderNo}")]
    public async Task<IActionResult> Get(string orderNo)
        => Ok(await _svc.GetAsync(orderNo));
}

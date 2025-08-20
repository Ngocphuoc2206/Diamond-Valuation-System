using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc; 
using Reporting.Application.Metrics.GetOverview;
using Reporting.Domain.Model;
using Reporting.Infrastructure.Persistence;
using System.Text;

namespace Reporting.Api.Controllers;

[ApiController]
[Route("reporting/metrics")]
public sealed class MetricsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly AppDbContext _db; // dùng cho data seed

    public MetricsController(IMediator mediator, AppDbContext db)
    {
        _mediator = mediator;
        _db = db;
    }

    // GET /reporting/metrics/overview
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        var result = await _mediator.Send(new GetOverviewQuery(from, to));
        return Ok(result);
    }

    // GET /reporting/metrics/orders
    [HttpGet("orders")]
    public IActionResult GetOrders()
    {
        var orders = _db.Orders.ToList();
        return Ok(orders);
    }

    // GET /reporting/metrics/products
    [HttpGet("products")]
    public IActionResult GetProducts()
    {
        var products = _db.Products.ToList();
        return Ok(products);
    }

    // GET /reporting/metrics/valuations
    [HttpGet("valuations")]
    public IActionResult GetValuations()
    {
        var valuations = _db.Valuations.ToList();
        return Ok(valuations);
    }

    // GET /reporting/metrics/staff
    [HttpGet("staff")]
    public IActionResult GetStaff()
    {
        var staff = _db.Staffs.ToList();
        return Ok(staff);
    }

    // GET /reporting/metrics/activities
    [HttpGet("activities")]
    public IActionResult GetActivities()
    {
        var activities = _db.Activities.ToList();
        return Ok(activities);
    }

    // GET /reporting/metrics/exports/products.csv
    [HttpGet("exports/products.csv")]
    public IActionResult ExportProductsCsv()
    {
        var products = _db.Products.ToList();

        var csv = "Id,Name,Description,Price,Stock\n";
        foreach (var p in products)
        {
            csv += $"{p.Id},{p.Name},{p.Description},{p.Price},{p.Stock}\n";
        }

        var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
        return File(bytes, "text/csv", "products.csv");
    }
}

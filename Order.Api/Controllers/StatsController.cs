using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.Domain.Enums;
using Order.Infrastructure;
using Order.Infrastructure.Data;

[ApiController]
[ApiVersion("1.0")]
[Route("api/orders")]
public class StatsController : ControllerBase
{
    private readonly OrderDbContext _db;
    public StatsController(OrderDbContext db) => _db = db;

    public record RevenuePoint(DateTime date, decimal total);
    public record OrderStatsDto(
        int totalOrders,
        int newOrders,
        int awaitingPayment,
        int paid,
        int cancelled,
        int fulfilled,
        decimal totalRevenue,
        IEnumerable<RevenuePoint> revenueDaily,
        IEnumerable<object> recentOrders
    );

    [Authorize(Roles = "Admin")]
    [HttpGet("stats")]
    public async Task<IActionResult> Get([FromQuery] int days = 30)
    {
        var since = DateTime.UtcNow.Date.AddDays(-Math.Abs(days));

        var q = _db.Orders.AsNoTracking();
        var totalOrders = await q.CountAsync();
        var newOrders = await q.CountAsync(o => o.CreatedAt >= since);
        var awaitingPayment = await q.CountAsync(o => o.Status == OrderStatus.AwaitingPayment);
        var paid = await q.CountAsync(o => o.Status == OrderStatus.Paid);
        var cancelled = await q.CountAsync(o => o.Status == OrderStatus.Cancelled);
        var fulfilled = await q.CountAsync(o => o.Status == OrderStatus.Fulfilled);

        var totalRevenue = await q.Where(o => o.Status == OrderStatus.Paid || o.Status == OrderStatus.Fulfilled)
                                  .SumAsync(o => (decimal?)o.Total) ?? 0m;

        // doanh thu theo ngày (UTC)
        var revenueDaily = await q.Where(o => o.CreatedAt >= since &&
                                              (o.Status == OrderStatus.Paid || o.Status == OrderStatus.Fulfilled))
                                  .GroupBy(o => o.CreatedAt.Value.Date)
                                  .Select(g => new RevenuePoint(g.Key, g.Sum(o => o.Total)))
                                  .OrderBy(x => x.date)
                                  .ToListAsync();

        // 10 đơn gần nhất
        var recentOrders = await q.OrderByDescending(o => o.CreatedAt)
                                  .Take(10)
                                  .Select(o => new {
                                      o.OrderNo,
                                      o.Total,
                                      o.Status,
                                      o.CreatedAt,
                                      o.CustomerId
                                  }).ToListAsync();

        return Ok(new OrderStatsDto(
            totalOrders, newOrders, awaitingPayment, paid, cancelled, fulfilled,
            totalRevenue, revenueDaily, recentOrders
        ));
    }
}

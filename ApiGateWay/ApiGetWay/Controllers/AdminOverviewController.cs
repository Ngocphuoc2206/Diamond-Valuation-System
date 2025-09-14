using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/overview")]
public class AdminOverviewController : ControllerBase
{
    private readonly IHttpClientFactory _http;
    private readonly IConfiguration _cfg;
    public AdminOverviewController(IHttpClientFactory http, IConfiguration cfg)
    {
        _http = http; _cfg = cfg;
    }

    public record RevenuePoint(string date, decimal total);
    public record OverviewPayload(
        object users,
        object orders,
        object valuations,
        object products
    );

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int days = 30, CancellationToken ct = default)
    {
        // base urls
        var u = _cfg["Integrations:User:BaseUrl"] ?? "http://user-api:8080";
        var o = _cfg["Integrations:Order:BaseUrl"] ?? "http://order-api:8080";
        var v = _cfg["Integrations:Valuation:BaseUrl"] ?? "http://valuation-api:8080";
        var p = _cfg["Integrations:Product:BaseUrl"] ?? "http://product-api:8080";

        var hcU = _http.CreateClient(); hcU.BaseAddress = new Uri(u);
        var hcO = _http.CreateClient(); hcO.BaseAddress = new Uri(o);
        var hcV = _http.CreateClient(); hcV.BaseAddress = new Uri(v);
        var hcP = _http.CreateClient(); hcP.BaseAddress = new Uri(p);

        // Chạy song song (có thể try/catch từng cái để không “đổ domino”)
        var orderTask = hcO.GetFromJsonAsync<object>($"/api/orders/stats?days={days}", ct);

        // Tuỳ bạn đã có endpoints chưa:
        var userTask = SafeGet(hcU, "/api/users/stats", ct);        // hoặc trả mock {}
        var valTask = SafeGet(hcV, "/api/valuations/stats", ct);   // hoặc mock {}
        var prodTask = SafeGet(hcP, "/api/products/stats", ct);     // hoặc mock {}

        await Task.WhenAll(orderTask, userTask, valTask, prodTask);

        var payload = new OverviewPayload(
            users: userTask.Result ?? new { },
            orders: orderTask.Result ?? new { },
            valuations: valTask.Result ?? new { },
            products: prodTask.Result ?? new { }
        );

        return Ok(new { success = true, data = payload });
    }

    private static async Task<object?> SafeGet(HttpClient hc, string path, CancellationToken ct)
    {
        try { return await hc.GetFromJsonAsync<object>(path, ct); }
        catch { return null; }
    }
}

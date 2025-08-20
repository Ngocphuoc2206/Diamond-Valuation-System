using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.Json;

namespace CommerceCoreService.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommerceController : ControllerBase
{
    private readonly CommerceDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public CommerceController(CommerceDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("record")]
    public async Task<IActionResult> RecordTransaction([FromBody] Transaction dto)
    {
        try
        {
            using var client = _httpClientFactory.CreateClient();
            var valuationResponse = await client.GetAsync($"http://localhost:5001/api/valuation/estimate/{dto.DiamondId}");
            if (!valuationResponse.IsSuccessStatusCode)
                throw new Exception("Failed to get valuation.");

            var valuation = JsonSerializer.Deserialize<double>(await valuationResponse.Content.ReadAsStringAsync());

            var transaction = new Transaction
            {
                DiamondId = dto.DiamondId,
                Amount = dto.Amount,
                Status = dto.Amount >= valuation ? "Completed" : "Failed"
            };
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return Ok(transaction);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
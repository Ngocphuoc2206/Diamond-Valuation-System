using Microsoft.AspNetCore.Mvc;
using Product.Application.DTOs;
using Product.Application.Services;

namespace Product.Api.Controllers;

[ApiController]
[Route("api/estimate")]
public class EstimationController : ControllerBase
{
    private readonly IEstimationService _service;

    public EstimationController(IEstimationService service) => _service = service;

    [HttpPost("by-criteria")]
    public async Task<ActionResult<EstimateResponse>> ByCriteria([FromBody] EstimateByCriteriaRequest req, CancellationToken ct)
        => Ok(await _service.EstimateByCriteriaAsync(req, ct));

    [HttpPost("by-certificate")]
    public async Task<ActionResult<EstimateResponse>> ByCertificate([FromBody] EstimateByCertificateRequest req, CancellationToken ct)
        => Ok(await _service.EstimateByCertificateAsync(req, ct));
}

using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Application.Services;
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Diamond.ValuationService.Infrastructure.Services;

public class ValuationServiceImpl : IValuationService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ValuationServiceImpl> _logger;
    public ValuationServiceImpl(AppDbContext db, ILogger<ValuationServiceImpl> logger) 
    { 
        _db = db;
        _logger = logger;
    }

    private static string NormOrigin(string? v)
        => (v ?? "Natural").Trim().Equals("lab-grown", StringComparison.OrdinalIgnoreCase) ? "Lab-Grown" : "Natural";

    private static string NormShape(string? v) => (v ?? "").Trim();
    private static string NormColor(string? v)
        => string.IsNullOrWhiteSpace(v) || v == "N-Z" || v == "Fancy" || v == "Unknown" ? "G" : v!.Trim().ToUpperInvariant();
    private static string NormClarity(string? v) => (v ?? "VS1").Trim().ToUpperInvariant();

    // Nếu cần dùng: Cut/Polish/Symmetry/Fluorescence mapping "Very Good" -> "VeryGood"
    private static string JoinWords(string? v) => string.IsNullOrWhiteSpace(v) ? "" : v!.Replace(" ", "");

    public async Task<EstimateResponseDto> EstimateAsync(EstimateRequestDto dto, CancellationToken ct = default)
    {
        _logger.LogInformation(
          "Estimate request => Origin:{Origin}, Shape:{Shape}, Color:{Color}, Clarity:{Clarity}, Carat:{Carat}",
          dto.Origin, dto.Shape, dto.Color, dto.Clarity, dto.Carat
        );
        if (dto.Carat <= 0) throw new ArgumentException("Carat phải > 0");
        if (string.IsNullOrWhiteSpace(dto.Shape)) throw new ArgumentException("Shape không hợp lệ");

        var origin = NormOrigin(dto.Origin);
        var shape = NormShape(dto.Shape);
        var color = NormColor(dto.Color);
        var clarity = NormClarity(dto.Clarity);

        // 1) tìm base row theo bảng giá
        var baseRow = await _db.PriceTable
            .Where(p => p.Origin == origin
                     && p.Shape == shape
                     && p.Color == color
                     && p.Clarity == clarity
                     && dto.Carat >= p.CaratFrom
                     && dto.Carat <= p.CaratTo)
            .OrderByDescending(p => p.EffectiveDate)
            .FirstOrDefaultAsync(ct);

        if (baseRow is null)
            throw new InvalidOperationException("Không tìm thấy dòng bảng giá phù hợp cho tiêu chí nhập vào.");

        // Tính hệ số
        var cutMul = Rules.CutMultiplier(JoinWords(dto.Cut));
        var finishMul = Rules.FinishMultiplier(JoinWords(dto.Polish), JoinWords(dto.Symmetry));
        var fluorMul = Rules.FluorescencePenalty(dto.Fluorescence ?? "None");
        var proportion = Rules.ProportionAdjustment(dto.TablePercent, dto.DepthPercent);

        var pricePerCt = Math.Round(baseRow.BasePricePerCarat * cutMul * finishMul * fluorMul * proportion, 2);
        var total = Math.Round(pricePerCt * dto.Carat, 2);

        var req = new ValuationRequest
        {
            CertificateNo = dto.CertificateNo,
            Spec = new DiamondSpec
            {
                Origin = origin,
                Shape = shape,
                Carat = dto.Carat,
                Color = color,
                Clarity = clarity,
                Cut = JoinWords(dto.Cut ?? "Excellent"),
                Polish = JoinWords(dto.Polish ?? "Excellent"),
                Symmetry = JoinWords(dto.Symmetry ?? "Excellent"),
                Fluorescence = dto.Fluorescence ?? "None",
                TablePercent = dto.TablePercent,
                DepthPercent = dto.DepthPercent,
                Measurements = dto.Measurements ?? ""
            },
            CustomerName = dto.CustomerName
        };

        var res = new ValuationResult
        {
            RequestId = req.Id,
            PricePerCarat = pricePerCt,
            TotalPrice = total,
            Currency = "USD",
            AlgorithmVersion = "1.0",
            ValuatedAt = DateTime.UtcNow
        };

        _db.ValuationRequests.Add(req);
        _db.ValuationResults.Add(res);
        await _db.SaveChangesAsync(ct);

        return new EstimateResponseDto
        {
            RequestId = req.Id,
            ResultId = res.Id,
            PricePerCarat = res.PricePerCarat,
            TotalPrice = res.TotalPrice,
            Currency = res.Currency,
            AlgorithmVersion = res.AlgorithmVersion,
            ValuatedAt = res.ValuatedAt
        };
    }
}

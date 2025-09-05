using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Application.Services;   // Rules
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Infrastructure.Services;

public class ValuationServiceImpl : IValuationService
{
    private readonly AppDbContext _db;

    public ValuationServiceImpl(AppDbContext db)
    {
        _db = db;
    }

    public async Task<EstimateResponseDto> EstimateAsync(EstimateRequestDto dto, CancellationToken ct = default)
    {
        // --- Validate nhanh ---
        if (dto.Carat <= 0) throw new ArgumentException("Carat phải > 0");
        if (string.IsNullOrWhiteSpace(dto.Shape)) throw new ArgumentException("Shape không hợp lệ");
        if (string.IsNullOrWhiteSpace(dto.Color)) throw new ArgumentException("Color không hợp lệ");
        if (string.IsNullOrWhiteSpace(dto.Clarity)) throw new ArgumentException("Clarity không hợp lệ");

        // 1) Tìm base price theo bảng giá
        var baseRow = await _db.PriceTable
            .Where(p => p.Origin == dto.Origin
                        && p.Shape == dto.Shape
                        && p.Color == dto.Color
                        && p.Clarity == dto.Clarity
                        && dto.Carat >= p.CaratFrom && dto.Carat <= p.CaratTo)
            .OrderByDescending(p => p.EffectiveDate)
            .FirstOrDefaultAsync(ct);

        if (baseRow is null)
            throw new InvalidOperationException("Không tìm thấy dòng bảng giá phù hợp cho tiêu chí nhập vào.");

        var basePpc = baseRow.BasePricePerCarat;

        // 2) Áp hệ số điều chỉnh
        var factor = Rules.CutMultiplier(dto.Cut)
                    * Rules.FinishMultiplier(dto.Polish, dto.Symmetry)
                    * Rules.FluorescencePenalty(dto.Fluorescence)
                    * Rules.ProportionAdjustment(dto.TablePercent, dto.DepthPercent);

        var pricePerCarat = Math.Round(basePpc * factor, 2);
        var total = Math.Round(pricePerCarat * dto.Carat, 2);

        // 3) Lưu request + result
        var req = new ValuationRequest
        {
            // NHẬN RequestId từ Request Service nếu có
            Id = dto.ExternalRequestId ?? Guid.NewGuid(),
            CertificateNo = dto.CertificateNo,
            CustomerName = dto.CustomerName,
            Spec = new DiamondSpec
            {
                Origin = dto.Origin,
                Shape = dto.Shape,
                Carat = dto.Carat,
                Color = dto.Color,
                Clarity = dto.Clarity,
                Cut = dto.Cut,
                Polish = dto.Polish,
                Symmetry = dto.Symmetry,
                Fluorescence = dto.Fluorescence,
                TablePercent = dto.TablePercent,
                DepthPercent = dto.DepthPercent,
                Measurements = dto.Measurements ?? ""
            }
        };
        _db.ValuationRequests.Add(req);

        var res = new ValuationResult
        {
            RequestId = req.Id,
            PricePerCarat = pricePerCarat,
            TotalPrice = total,
            Currency = "USD",
            AlgorithmVersion = "1.0.0",
            Notes = ""
        };
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

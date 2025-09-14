using System;

namespace InvoiceService.Domain.ValueObjects;

public class DiamondInfo
{
    public string ShapeCut { get; private set; } = string.Empty; // "Princess Cut",...
    public decimal CaratWeight { get; private set; }             // 1.8
    public string? ColorGrade { get; private set; }              // D..Z (optional)
    public string? ClarityGrade { get; private set; }            // VVS1, VS2,...
    public string? CutGrade { get; private set; }                // Excellent, Very Good,...

    private DiamondInfo() { } // EF
    public DiamondInfo(string shapeCut, decimal carat, string? color, string? clarity, string? cut)
    {
        if (string.IsNullOrWhiteSpace(shapeCut)) throw new ArgumentException("Shape/Cut is required");
        if (carat <= 0) throw new ArgumentException("Carat must be > 0");
        ShapeCut = shapeCut.Trim();
        CaratWeight = decimal.Round(carat, 2);
        ColorGrade = color?.Trim();
        ClarityGrade = clarity?.Trim();
        CutGrade = cut?.Trim();
    }
}

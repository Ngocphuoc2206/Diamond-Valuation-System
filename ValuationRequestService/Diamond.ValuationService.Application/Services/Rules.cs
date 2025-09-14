namespace Diamond.ValuationService.Application.Services;

public static class Rules
{
    // Hệ số điều chỉnh mẫu (demo). Thực tế có thể cấu hình trong DB.
    public static decimal CutMultiplier(string cut) => cut switch
    {
        "Excellent" => 1.05m,
        "VeryGood" => 1.02m,
        "Good" => 1.00m,
        _ => 0.98m
    };

    public static decimal FinishMultiplier(string polish, string symmetry)
    {
        var p = polish == "Excellent" ? 1.01m : polish == "VeryGood" ? 1.005m : 1.0m;
        var s = symmetry == "Excellent" ? 1.01m : symmetry == "VeryGood" ? 1.005m : 1.0m;
        return p * s;
    }

    public static decimal FluorescencePenalty(string fl) => fl switch
    {
        "Strong" => 0.95m,
        "Medium" => 0.98m,
        _ => 1.00m
    };

    public static decimal ProportionAdjustment(decimal tablePct, decimal depthPct)
    {
        // Demo: lệch nhiều thì giảm nhẹ
        var adj = 1.00m;
        if (tablePct < 54 || tablePct > 61) adj -= 0.01m;
        if (depthPct < 59 || depthPct > 63) adj -= 0.01m;
        return adj;
    }
}

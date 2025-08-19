namespace Diamond.ValuationService.Services;

using Diamond.ValuationService.Models;

public record Adjustment(string Code, decimal? Percent, string Reason);

public interface IRuleEngine
{
    (decimal percentSum, List<Adjustment> details, double confidence) Apply(DiamondSpec s);
}

public class RuleEngineV1 : IRuleEngine
{
    public (decimal, List<Adjustment>, double) Apply(DiamondSpec s)
    {
        decimal p = 0m;
        var list = new List<Adjustment>();

        if (s.Cut.Equals("Excellent", StringComparison.OrdinalIgnoreCase))
            { p += 0.03m; list.Add(new("CUT_EXC", 0.03m, "Excellent cut")); }

        if (s.Proportions.Equals("Ideal", StringComparison.OrdinalIgnoreCase))
            { p += 0.02m; list.Add(new("PROP_IDEAL", 0.02m, "Ideal proportions")); }

        if (s.Fluorescence.Equals("Strong", StringComparison.OrdinalIgnoreCase))
            { p -= 0.02m; list.Add(new("FLUO_STRONG", -0.02m, "Strong fluorescence")); }

        var conf = 0.8 + Math.Min(list.Count * 0.05, 0.15);
        return (p, list, conf);
    }
}

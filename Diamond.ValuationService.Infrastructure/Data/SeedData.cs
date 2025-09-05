using Diamond.ValuationService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Infrastructure.Data;

public static class PriceTableSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Nếu đã có dữ liệu thì bỏ qua
        if (await db.PriceTable.AnyAsync()) return;

        var origins = new Dictionary<string, decimal>
        {
            ["Natural"] = 1.0m,
            ["Lab-Grown"] = 0.22m
        };

        var shapes = new Dictionary<string, decimal>
        {
            ["Round"] = 1.00m,
            ["Princess"] = 0.95m,
            ["Cushion"] = 0.90m,
            ["Emerald"] = 0.92m,
            ["Oval"] = 0.96m,
            ["Pear"] = 0.94m,
            ["Marquise"] = 0.85m,
            ["Radiant"] = 0.93m,
            ["Asscher"] = 0.88m,
            ["Heart"] = 0.97m,
        };

        var colors = new Dictionary<string, decimal>
        {
            ["D"] = 1.30m,
            ["E"] = 1.25m,
            ["F"] = 1.20m,
            ["G"] = 1.15m,
            ["H"] = 1.10m,
            ["I"] = 1.05m,
            ["J"] = 1.00m,
            ["K"] = 0.92m,
            ["L"] = 0.85m,
            ["M"] = 0.78m,
        };

        var clarities = new Dictionary<string, decimal>
        {
            ["FL"] = 1.50m,
            ["IF"] = 1.40m,
            ["VVS1"] = 1.30m,
            ["VVS2"] = 1.22m,
            ["VS1"] = 1.15m,
            ["VS2"] = 1.08m,
            ["SI1"] = 0.98m,
            ["SI2"] = 0.88m,
            ["I1"] = 0.75m,
            ["I2"] = 0.60m,
            ["I3"] = 0.45m
        };

        var caratBuckets = new (decimal from, decimal to, decimal mult)[]
        {
            (0.10m, 0.29m, 0.65m),
            (0.30m, 0.49m, 0.80m),
            (0.50m, 0.69m, 0.95m),
            (0.70m, 0.89m, 1.05m),
            (0.90m, 1.09m, 1.15m),
            (1.10m, 1.49m, 1.30m),
            (1.50m, 1.99m, 1.55m),
            (2.00m, 2.99m, 1.90m),
            (3.00m, 4.99m, 2.40m)
        };

        const decimal baseline = 6000m;

        var list = new List<PriceTableEntry>();

        foreach (var o in origins)
            foreach (var s in shapes)
                foreach (var c in colors)
                    foreach (var cl in clarities)
                        foreach (var ca in caratBuckets)
                        {
                            var price = baseline * o.Value * s.Value * c.Value * cl.Value * ca.mult;

                            list.Add(new PriceTableEntry
                            {
                                Id = Guid.NewGuid(),
                                Origin = o.Key,
                                Shape = s.Key,
                                Color = c.Key,
                                Clarity = cl.Key,
                                CaratFrom = ca.from,
                                CaratTo = ca.to,
                                BasePricePerCarat = price,
                                EffectiveDate = DateTime.UtcNow
                            });
                        }

        await db.PriceTable.AddRangeAsync(list);
        await db.SaveChangesAsync();
    }
}

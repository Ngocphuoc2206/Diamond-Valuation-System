using Diamond.ValuationService.Domain.Entities;

namespace Diamond.ValuationService.Infrastructure.Data;

public static class Seed
{
    public static async Task SeedAsync(AppDbContext db, CancellationToken ct = default)
    {
        if (!db.PriceTable.Any())
        {
            db.PriceTable.AddRange(new[]
            {
                // ví dụ bảng giá tham chiếu (demo)
                new PriceTableEntry { Origin="Natural", Shape="Round", Color="G", Clarity="VS1", CaratFrom=0.90m, CaratTo=0.99m, BasePricePerCarat=7000 },
                new PriceTableEntry { Origin="Natural", Shape="Round", Color="G", Clarity="VS1", CaratFrom=1.00m, CaratTo=1.49m, BasePricePerCarat=9000 },
                new PriceTableEntry { Origin="Natural", Shape="Round", Color="D", Clarity="IF",  CaratFrom=1.00m, CaratTo=1.49m, BasePricePerCarat=15000 },
                // thêm các dòng khác tùy nhu cầu
            });
            await db.SaveChangesAsync(ct);
        }
    }
}

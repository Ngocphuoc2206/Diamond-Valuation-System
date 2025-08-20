using System;
using System.Threading;
using System.Threading.Tasks;

using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

// QuestPDF
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using QuestPDF;

namespace Diamond.ValuationService.Infrastructure.Service;

public class PdfService : IPdfService
{
    static PdfService()
    {
        // Bắt buộc với QuestPDF (Community)
        Settings.License = LicenseType.Community;
    }

    private readonly AppDbContext _db;
    public PdfService(AppDbContext db) => _db = db;

    public async Task<byte[]> GenerateValuationCertificateAsync(Guid resultId, CancellationToken ct = default)
    {
        var result = await _db.ValuationResults.FirstOrDefaultAsync(x => x.Id == resultId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy kết quả định giá.");

        var request = await _db.ValuationRequests
            .Include(r => r.Spec)
            .FirstOrDefaultAsync(r => r.Id == result.RequestId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy yêu cầu định giá tương ứng.");

        // Dùng tên đầy đủ để tránh trùng tên với lớp khác tên 'Document'
        var doc = Document.Create(d =>
        {
            d.Page(p =>
            {
                p.Size(PageSizes.A4);
                p.Margin(25);
                p.DefaultTextStyle(t => t.FontSize(11));

                p.Content().Column(col =>
                {
                    col.Item().Text("DIAMOND VALUATION CERTIFICATE").FontSize(18).SemiBold().AlignCenter();
                    col.Item().Text($"Certificate No: {request.CertificateNo ?? "-"}").AlignCenter().Italic();
                    col.Item().Text($"Customer: {request.CustomerName ?? "-"}").AlignCenter();
                    col.Item().Text($"Request ID: {request.Id}").AlignCenter();

                    col.Item().PaddingVertical(6).LineHorizontal(1);

                    col.Item().Text($"Total Price: {result.TotalPrice:0,0.00} {result.Currency}")
                              .FontSize(14).SemiBold();
                    col.Item().Text($"Price/Carat: {result.PricePerCarat:0,0.00} {result.Currency}");
                    col.Item().Text($"Valuated At (UTC): {result.ValuatedAt:yyyy-MM-dd HH:mm:ss}");
                });
            });
        });

        return doc.GeneratePdf();
    }
}

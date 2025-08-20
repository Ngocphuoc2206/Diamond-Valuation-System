namespace Diamond.ValuationService.Application.Interfaces;

public interface IPdfService
{
    Task<byte[]> GenerateValuationCertificateAsync(Guid resultId, CancellationToken ct = default);
}

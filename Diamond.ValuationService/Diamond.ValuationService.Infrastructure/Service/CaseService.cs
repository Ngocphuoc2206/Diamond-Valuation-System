using System;
using System.Threading;
using System.Threading.Tasks;
using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Infrastructure.Services;

public class CaseService : ICaseService
{
    private readonly AppDbContext _db;
    public CaseService(AppDbContext db) => _db = db;

    public async Task<CreateCaseResponseDto> CreateAsync(CreateCaseRequestDto dto, CancellationToken ct = default)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));
        if (dto.Carat <= 0) throw new ArgumentOutOfRangeException(nameof(dto.Carat), "Carat must be > 0");

        // Chuẩn hoá dữ liệu đơn giản
        string norm(string? s) => s?.Trim() ?? string.Empty;

        var strategy = _db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await _db.Database.BeginTransactionAsync(ct);

            try
            {
                // 1) Tìm hoặc tạo Contact theo Email
                var email = norm(dto.Email);
                var contact = await _db.Contacts
                    .FirstOrDefaultAsync(x => x.Email == email, ct);

                if (contact is null)
                {
                    contact = new Contact
                    {
                        FullName = norm(dto.FullName),
                        Email = email,
                        Phone = norm(dto.Phone),
                        PreferredMethod = norm(dto.PreferredContactMethod)
                    };
                    _db.Contacts.Add(contact);
                }
                else
                {
                    // cập nhật thông tin mới (idempotent)
                    contact.FullName = norm(dto.FullName);
                    contact.Phone = norm(dto.Phone);
                    contact.PreferredMethod = norm(dto.PreferredContactMethod);
                    _db.Contacts.Update(contact);
                }

                // 2) Tạo ValuationCase
                var vc = new ValuationCase
                {
                    Contact = contact, // set navigation thay vì ContactId
                    CertificateNo = string.IsNullOrWhiteSpace(dto.CertificateNo) ? null : dto.CertificateNo.Trim(),
                    Origin = norm(dto.Origin),
                    Shape = norm(dto.Shape),
                    Carat = dto.Carat,
                    Color = norm(dto.Color),
                    Clarity = norm(dto.Clarity),
                    Cut = norm(dto.Cut),
                    Polish = norm(dto.Polish),
                    Symmetry = norm(dto.Symmetry),
                    Fluorescence = norm(dto.Fluorescence),
                    Status = CaseStatus.LienHe,   // sau khi nhập Liên Hệ
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.ValuationCases.Add(vc);

                // 3) Lưu & commit
                await _db.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);

                return new CreateCaseResponseDto(vc.Id, vc.Status.ToString());
            }
            catch (DbUpdateException)
            {
                await tx.RollbackAsync(ct);
                throw; // để middleware hiển thị lỗi chi tiết (DeveloperExceptionPage)
            }
            catch
            {
                await tx.RollbackAsync(ct);
                throw;
            }
        });
    }

    public async Task<bool> UpdateStatusAsync(Guid caseId, CaseStatus status, CancellationToken ct = default)
    {
        var vc = await _db.ValuationCases.FirstOrDefaultAsync(x => x.Id == caseId, ct);
        if (vc is null) return false;

        // TODO: thêm validation chuyển trạng thái nếu có quy tắc business
        vc.Status = status;
        vc.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return true;
    }
}

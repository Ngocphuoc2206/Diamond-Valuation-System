using ValuationRespon.Application.Interfaces;
using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Application.Services
{
    public class ValuationCaseService : IValuationCaseService
    {
        private readonly IValuationCaseRepository _repo;
        private readonly IEmailService _emailService;

        public ValuationCaseService(IValuationCaseRepository repo, IEmailService emailService)
        {
            _repo = repo;
            _emailService = emailService;
        }

        public async Task<ValuationCase> CreateCaseAsync(ValuationCase request)
        {
            return await _repo.AddCaseAsync(request);
        }

        public async Task<ValuationTimeline> AddTimelineAsync(Guid caseId, ValuationTimeline timeline)
        {
            timeline.ValuationCaseId = caseId;
            var tl = await _repo.AddTimelineAsync(timeline);

            var vc = await _repo.GetCaseAsync(caseId);
            if (vc != null && timeline.Step == "Valuation")
            {
                vc.Status = "InProgress";
                await _repo.UpdateCaseAsync(vc);
            }

            return tl;
        }

        public async Task<ValuationResult> CompleteValuationAsync(Guid caseId, ValuationResult result)
        {
            result.ValuationCaseId = caseId;
            var r = await _repo.AddResultAsync(result);

            var vc = await _repo.GetCaseAsync(caseId);
            if (vc != null)
            {
                vc.Status = "Completed";
                await _repo.UpdateCaseAsync(vc);

                // Gửi email cho khách hàng
                string subject = "Kết quả định giá kim cương của bạn";
                string body = $@"
                    Xin chào {vc.FullName},<br/><br/>
                    Kết quả định giá đã hoàn tất:<br/>
                    - Giá trị thị trường: {r.MarketValue}$<br/>
                    - Giá trị bảo hiểm: {r.InsuranceValue}$<br/>
                    - Giá trị bán lẻ: {r.RetailValue}$<br/><br/>
                    Ghi chú: {r.Notes}<br/><br/>
                    Trân trọng,<br/>Diamond Valuation Team
                ";
                await _emailService.SendEmailAsync(vc.Email, subject, body);
            }

            return r;
        }
    }
}

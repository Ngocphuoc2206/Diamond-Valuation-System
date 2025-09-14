using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Application.Interfaces
{
    public interface ICaseStatusClient
    {
        Task UpdateStatusAsync(Guid caseId, string status, CancellationToken ct = default);
        Task UpdateResultAsync(Guid caseId, decimal pricePerCarat, decimal totalPrice, string currency, string algorithmVersion, DateTime valuatedAt, CancellationToken ct = default);
    }
}

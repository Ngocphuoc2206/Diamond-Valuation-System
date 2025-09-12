using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ValuationRespon.Application.Interfaces
{
    public interface ICaseQueryClient
    {
        Task<(string? CustomerName, string? Email)> GetContactAsync(Guid caseId, CancellationToken ct = default);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using ValuationRespon.Application.Interfaces;

namespace ValuationRespon.Infrastructure.Services
{
    public class CaseStatusClient : ICaseStatusClient
    {
        private readonly HttpClient _http;

        public CaseStatusClient(HttpClient http)
        {
            _http = http;
        }

        public Task UpdateStatusAsync(Guid caseId, string status, CancellationToken ct = default)
        {
            var payload = new { status };
            return _http.PutAsJsonAsync($"/api/cases/{caseId}/status", payload, ct);
        }

        public Task UpdateResultAsync(Guid caseId, decimal pricePerCarat, decimal totalPrice, string currency, string algorithmVersion, DateTime valuatedAt, CancellationToken ct = default)
        {
            var payload = new
            {
                pricePerCarat,
                totalPrice,
                currency,
                algorithmVersion,
                valuatedAt
            };
            return _http.PutAsJsonAsync($"/api/cases/{caseId}/result", payload, ct);
        }
    }
}

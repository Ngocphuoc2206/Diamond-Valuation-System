using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ValuationRespon.Application.Interfaces;

namespace ValuationRespon.Infrastructure.Services
{
    public class CaseQueryClient : ICaseQueryClient
    {
        private readonly HttpClient _http;
        public CaseQueryClient(HttpClient http) => _http = http;

        public async Task<(string?, string?)> GetContactAsync(Guid caseId, CancellationToken ct = default)
        {
            var res = await _http.GetAsync($"/api/cases/{caseId}", ct);
            res.EnsureSuccessStatusCode();
            var json = await res.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            var name = json.TryGetProperty("fullName", out var n) ? n.GetString() : null;
            var email = json.TryGetProperty("email", out var e) ? e.GetString() : null;
            return (name, email);
        }
    }
}

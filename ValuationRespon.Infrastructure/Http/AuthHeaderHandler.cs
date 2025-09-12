using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ValuationRespon.Infrastructure.Http
{
    public sealed class AuthHeaderHandler : DelegatingHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AuthHeaderHandler(IHttpContextAccessor httpContextAccessor)
            => _httpContextAccessor = httpContextAccessor;

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var auth = _httpContextAccessor.HttpContext?.Request?.Headers["Authorization"].ToString();
            if (!string.IsNullOrWhiteSpace(auth) &&
                AuthenticationHeaderValue.TryParse(auth, out var header))
            {
                request.Headers.Authorization = header; // Bearer <jwt>
            }
            return base.SendAsync(request, cancellationToken);
        }
    }
}

using MediatR;
using Reporting.Application.Abstractions;
using Reporting.Application.Interfaces;

namespace Reporting.Application.Metrics.GetOverview;

public class GetOverviewHandler : IRequestHandler<GetOverviewQuery, OverviewVm>
{
    private readonly IReportingReadDb _readDb;

    public GetOverviewHandler(IReportingReadDb readDb) => _readDb = readDb;

    public Task<OverviewVm> Handle (GetOverviewQuery request, CancellationToken cancellationToken)
        => _readDb.GetOverviewAsync(request.From, request.To);
}

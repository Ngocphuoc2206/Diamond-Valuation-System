using Reporting.Application.Abstractions;

namespace Reporting.Application.Interfaces
{
    public interface IReportingReadDb
    {
        Task<OverviewVm> GetOverviewAsync(DateTime from, DateTime to);
    }
}

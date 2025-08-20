using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Reporting.Application.Abstractions;
using Reporting.Application.Interfaces;

namespace Reporting.Infrastructure.Persistence;
public class SqlReportingReadDb : IReportingReadDb
{
    public Task<OverviewVm> GetOverviewAsync(DateTime from, DateTime to)
        => Task.FromResult(new OverviewVm
        {
            MonthlyRevenue = 342890,
            NewCustomers = 284,
            ConversionRate = 18.2,
            AvgOrderValue = 1847
        });
}

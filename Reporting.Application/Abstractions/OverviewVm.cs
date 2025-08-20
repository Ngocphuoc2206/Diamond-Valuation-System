using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Application.Abstractions
{
    public class OverviewVm
    {
        public decimal MonthlyRevenue { get; init; }
        public int NewCustomers { get; init; }
        public double ConversionRate { get; init; }
        public decimal AvgOrderValue { get; init; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Domain.Model
{
    public class DashboardStat
    {
        public int Id { get; set; }
        public int TotalUsers { get; set; }
        public int TotalValuations { get; set; }
        public int PendingValuations { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int CompletedOrders { get; set; }
        public int PendingOrders { get; set; }
        public double CustomerRating { get; set; }
        public double AvgTurnaroundTime { get; set; }
    }
}

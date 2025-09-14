using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Application.DTOs
{
    public record MyOrderSummaryDto(int TotalOrders, int InProgress, int Completed, decimal TotalAmount);
}

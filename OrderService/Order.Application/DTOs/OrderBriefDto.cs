using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Application.DTOs
{
    public record OrderBriefDto(int Id, string OrderNo, DateTime? CreatedAt, string Status, decimal Total);
}

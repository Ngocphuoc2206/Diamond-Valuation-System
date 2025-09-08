using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public record PagedResult<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int Total)
    {
        public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
    }
}

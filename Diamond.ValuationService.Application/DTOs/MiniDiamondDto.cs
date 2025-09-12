using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public record MiniDiamondDto(string? Type, decimal? Carat, string? Color, string? Shape, string? Clarity, string? Cut);
}

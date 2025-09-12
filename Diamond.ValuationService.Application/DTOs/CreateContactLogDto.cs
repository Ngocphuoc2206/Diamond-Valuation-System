using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public record CreateContactLogDto(string Channel, string Outcome, string? Note, DateTime? NextFollowUpAt);
}

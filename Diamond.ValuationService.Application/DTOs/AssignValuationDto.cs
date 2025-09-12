using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public class AssignValuationDto
    {
        [Required] public int ValuationId { get; set; }
        [Required, StringLength(200)] public string ValuationName { get; set; } = default!;
    }
}

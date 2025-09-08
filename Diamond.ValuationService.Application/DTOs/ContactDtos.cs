using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diamond.ValuationService.Application.DTOs
{
    public class ContactDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Phone { get; set; } = default!;
        public string? PreferredMethod { get; set; }
        public int? UserId { get; set; }
    }
}

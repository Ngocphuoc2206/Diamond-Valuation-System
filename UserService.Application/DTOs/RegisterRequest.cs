using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Application.DTOs
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; } = null;

        [Required]
        public string? Password { get; set; } = null;

        [Required]
        public string? FirstName { get; set; } = null;
        
        [Required]
        public string? LastName { get; set; } = null;

        public string? Phone { get; set; } = null;
    }
}

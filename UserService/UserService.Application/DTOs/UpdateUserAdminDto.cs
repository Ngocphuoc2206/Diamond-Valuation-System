using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Application.DTOs
{
    public class UpdateUserAdminDto
    {

        public UpdateUserAdminDto(string fullName, string email)
        {
            FullName = fullName;
            Email = email;
        }

        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}

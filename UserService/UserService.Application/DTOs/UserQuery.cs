using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Application.DTOs
{
    public class UserQuery
    {
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 20;
        public string? Role { get; set; }
        public string? Status { get; set; }
        public string? Q { get; set; }     // search by name/email
        public string? SortBy { get; set; } = "createdAt";
        public string? SortDir { get; set; } = "desc";
    }
}

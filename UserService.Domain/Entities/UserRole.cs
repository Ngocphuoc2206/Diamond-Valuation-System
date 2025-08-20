using SharedKernel.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Domain.Entities
{
    public class UserRole : BaseEntity
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public User User { get; set; } = default!;
        public Role Role { get; set; } = default!;
    }
}

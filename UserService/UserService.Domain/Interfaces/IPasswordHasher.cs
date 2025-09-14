using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Domain.Interfaces
{
    public interface IPasswordHasher
    {
        (string hash, string salt) Hash(string password);
        bool Verify(string password, string hash, string salt);
    }
}

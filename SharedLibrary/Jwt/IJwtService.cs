using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SharedLibrary.Jwt
{
    public interface IJwtService
    {
        string GenerateToken(IEnumerable<Claim> claims);
    }
}

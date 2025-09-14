using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using UserService.Domain.Interfaces;

namespace UserService.Infrastructure.Security
{
    public class PasswordHasher : IPasswordHasher
    {
        public (string hash, string salt) Hash(string password)
        {
            var saltBytes = RandomNumberGenerator.GetBytes(16);
            var salt = Convert.ToBase64String(saltBytes);
            var hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password, saltBytes, KeyDerivationPrf.HMACSHA256, 100_000, 32));
            return (hash, salt);
        }

        public bool Verify(string password, string hash, string salt)
        {
            var saltBytes = Convert.FromBase64String(salt);
            var computed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password, saltBytes, KeyDerivationPrf.HMACSHA256, 100_000, 32));
            return CryptographicOperations.FixedTimeEquals(
                Convert.FromBase64String(hash), Convert.FromBase64String(computed));
        }
    }
}

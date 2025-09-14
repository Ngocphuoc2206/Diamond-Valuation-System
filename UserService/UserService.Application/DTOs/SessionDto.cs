using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserService.Application.DTOs
{
    public record SessionDto(
        int Id,
        string? DeviceInfo,
        string? IpAddress,
        DateTime ExpiresAt,
        bool IsRevoked,
        DateTime CreatedAt
    );
}

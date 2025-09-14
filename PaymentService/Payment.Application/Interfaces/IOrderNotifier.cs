using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payment.Application.Interfaces
{
    public interface IOrderNotifier
    {
        Task NotifyAsync(string orderCode, string status, string? providerRef = null);
    }
}

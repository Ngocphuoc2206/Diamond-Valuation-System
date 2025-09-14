using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Application.DTOs
{
    public record PaymentCallbackDto(string OrderCode, string Status, string? ProviderRef = null);
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventory.Domain.Entities
{
    public class InventoryReservationLine
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public InventoryReservation Reservation { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public int Quantity { get; set; }
    }
}

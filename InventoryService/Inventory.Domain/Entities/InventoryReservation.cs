using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventory.Domain.Entities
{
    public class InventoryReservation
    {
        public int Id { get; set; }
        public string OrderNo { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool Confirmed { get; set; } // đã trừ thực
        public ICollection<InventoryReservationLine> Lines { get; set; } = new List<InventoryReservationLine>();
    }
}

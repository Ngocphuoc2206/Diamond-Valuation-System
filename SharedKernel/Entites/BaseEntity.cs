using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.Entites
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; } = null;
        public DateTime? UpdatedAt { get; set; } = null;
        public string? CreatedBy { get; set; } = null;
        public string? UpdatedBy { get; set; } = null;
        public bool IsDeleted { get; set; }
    }
}

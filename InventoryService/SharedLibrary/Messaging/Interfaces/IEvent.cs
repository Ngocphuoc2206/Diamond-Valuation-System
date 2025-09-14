using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedLibrary.Messaging.Interfaces
{
    public interface IEvent
    {
        Guid ID { get; }
        DateTime CreationDate { get; }
        string EventType { get; }
    }
}

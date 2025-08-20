using SharedLibrary.Messaging.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedLibrary.Messaging.Events
{
    public abstract class BaseEvent : IEvent
    {
        public Guid ID { get; }

        public DateTime CreationDate { get; }

        public string EventType => GetType().Name;

        protected BaseEvent()
        {
            ID = Guid.NewGuid();
            CreationDate = DateTime.UtcNow;
        }
    }
}

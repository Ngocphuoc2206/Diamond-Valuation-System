using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SharedLibrary.Messaging
{
    public class IntegrationEvent
    {
        [JsonInclude]
        public Guid Id { get; private set; }
        [JsonInclude]
        public DateTime CreatedAt { get; private set; }
        
        public IntegrationEvent()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        [JsonConstructor]
        public IntegrationEvent(Guid id, DateTime createdAt)
        {
            Id = id;
            CreatedAt = createdAt;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedLibrary.Messaging.Events.UserEvents
{
    public class UserUpdatedEvent: BaseEvent
    {
        public int UserId { get; }
        public string Email { get; }
        public string FullName { get; }
        public DateTime UpdatedAt { get; }

        public UserUpdatedEvent(int userId, string email, string fullName)
        {
            UserId = userId;
            Email = email;
            FullName = fullName;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedLibrary.Messaging.Events.UserEvents
{
    public class UserRegisteredEvent: BaseEvent
    {
        public int UserId { get; }
        public string Email { get;}
        public string FullName { get; }
        public string Role { get; }
        public UserRegisteredEvent(int userId, string email, string fullName, string role)
        {
            UserId = userId;
            Email = email;
            FullName = fullName;
            Role = role;
        }
    }
}

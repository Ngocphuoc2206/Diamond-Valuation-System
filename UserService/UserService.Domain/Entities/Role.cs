using SharedKernel.Entites;

namespace UserService.Domain.Entities
{
    public class Role : BaseEntity
    {
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
using Volo.Abp.Domain.Entities;

namespace QuickTemplate.Identity.Roles;

public class RoleUpdateDto: RoleCreateOrUpdateDtoBase, IHasConcurrencyStamp
{
    public string ConcurrencyStamp { get; set; }
}
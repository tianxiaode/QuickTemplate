using System.Collections.Generic;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Roles;

public class RoleCreateOrUpdateDtoBase: IdentityRoleCreateOrUpdateDtoBase
{
    public List<string> Permissions { get; set; }
}
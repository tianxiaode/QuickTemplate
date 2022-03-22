using System.Collections.Generic;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Roles;

public class RoleDto: IdentityRoleDto
{
    public List<string> Permissions { get; set; }
}
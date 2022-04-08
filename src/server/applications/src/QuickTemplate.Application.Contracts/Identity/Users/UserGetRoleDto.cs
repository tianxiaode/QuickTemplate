using QuickTemplate.Identity.Roles;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Users;

public class UserGetRoleDto: RoleDto
{
    public bool IsSelected { get; set; }

}
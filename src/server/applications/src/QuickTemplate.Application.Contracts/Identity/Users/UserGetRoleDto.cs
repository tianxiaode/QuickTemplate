using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Users;

public class UserGetRoleDto: IdentityRoleDto
{
    public bool IsSelected { get; set; }
}
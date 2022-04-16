using Volo.Abp.Identity;
using Volo.Abp.Validation;

namespace QuickTemplate.Identity.Users;

public class UserUpdateNameDto
{
    [DynamicStringLength(typeof(IdentityUserConsts), nameof(IdentityUserConsts.MaxNameLength))]
    public string Value { get; set; }

}
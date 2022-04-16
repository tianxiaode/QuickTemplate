using Volo.Abp.Identity;
using Volo.Abp.Validation;

namespace QuickTemplate.Identity.Users;

public class UserUpdateSurnameDto
{
    [DynamicStringLength(typeof(IdentityUserConsts), nameof(IdentityUserConsts.MaxSurnameLength))]
    public string Value { get; set; }

}
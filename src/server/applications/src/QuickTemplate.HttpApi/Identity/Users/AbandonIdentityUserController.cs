using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Users;

[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IdentityUserController), IncludeSelf = true)]
[RemoteService(false)]
public class AbandonIdentityUserController: IdentityUserController
{
    public AbandonIdentityUserController(IIdentityUserAppService userAppService) : base(userAppService)
    {
    }
}
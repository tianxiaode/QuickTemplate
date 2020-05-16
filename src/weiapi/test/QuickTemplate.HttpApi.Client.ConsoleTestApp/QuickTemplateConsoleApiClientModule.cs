using Volo.Abp.Http.Client.IdentityModel;
using Volo.Abp.Modularity;

namespace QuickTemplate.HttpApi.Client.ConsoleTestApp
{
    [DependsOn(
        typeof(QuickTemplateHttpApiClientModule),
        typeof(AbpHttpClientIdentityModelModule)
        )]
    public class QuickTemplateConsoleApiClientModule : AbpModule
    {
        
    }
}

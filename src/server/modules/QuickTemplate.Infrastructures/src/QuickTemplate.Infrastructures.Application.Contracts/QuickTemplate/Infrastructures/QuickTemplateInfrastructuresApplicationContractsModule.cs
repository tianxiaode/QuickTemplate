using Volo.Abp.Application;
using Volo.Abp.Authorization;
using Volo.Abp.Modularity;

namespace QuickTemplate.Infrastructures
{
    [DependsOn(
        typeof(QuickTemplateInfrastructuresDomainSharedModule),
        typeof(AbpDddApplicationContractsModule),
        typeof(AbpAuthorizationModule)
        )]
    public class QuickTemplateInfrastructuresApplicationContractsModule : AbpModule
    {

    }
}

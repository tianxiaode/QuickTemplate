using Generic.Abp.Domain;
using Volo.Abp.Modularity;

namespace QuickTemplate.Infrastructures
{
    [DependsOn(
        typeof(GenericAbpDddDomainModule),
        typeof(QuickTemplateInfrastructuresDomainSharedModule)
    )]
    public class QuickTemplateInfrastructuresDomainModule : AbpModule
    {

    }
}

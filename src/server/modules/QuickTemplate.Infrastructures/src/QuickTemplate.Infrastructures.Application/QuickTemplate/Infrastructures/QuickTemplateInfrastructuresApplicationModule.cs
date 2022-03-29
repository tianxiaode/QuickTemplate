using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;
using Volo.Abp.Application;

namespace QuickTemplate.Infrastructures
{
    [DependsOn(
        typeof(QuickTemplateInfrastructuresDomainModule),
        typeof(QuickTemplateInfrastructuresApplicationContractsModule),
        typeof(AbpDddApplicationModule),
        typeof(AbpAutoMapperModule)
        )]
    public class QuickTemplateInfrastructuresApplicationModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAutoMapperObjectMapper<QuickTemplateInfrastructuresApplicationModule>();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<QuickTemplateInfrastructuresApplicationModule>(validate: true);
            });
        }
    }
}

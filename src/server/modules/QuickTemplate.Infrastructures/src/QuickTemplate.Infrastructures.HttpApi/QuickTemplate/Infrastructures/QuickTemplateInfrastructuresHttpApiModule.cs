using Localization.Resources.AbpUi;
using QuickTemplate.Infrastructures.Localization;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Microsoft.Extensions.DependencyInjection;

namespace QuickTemplate.Infrastructures
{
    [DependsOn(
        typeof(QuickTemplateInfrastructuresApplicationContractsModule),
        typeof(AbpAspNetCoreMvcModule))]
    public class QuickTemplateInfrastructuresHttpApiModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            PreConfigure<IMvcBuilder>(mvcBuilder =>
            {
                mvcBuilder.AddApplicationPartIfNotExists(typeof(QuickTemplateInfrastructuresHttpApiModule).Assembly);
            });
        }

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Get<InfrastructuresResource>();
            });
        }
    }
}

using Generic.Abp.BusinessException;
using Generic.Abp.BusinessException.Localization;
using Generic.Abp.Domain;
using QuickTemplate.Infrastructures.Localization;
using Volo.Abp.Localization;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace QuickTemplate.Infrastructures
{
    [DependsOn(
        typeof(GenericAbpBusinessExceptionModule),
        typeof(GenericAbpDddDomainSharedModule)
    )]
    public class QuickTemplateInfrastructuresDomainSharedModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.AddEmbedded<QuickTemplateInfrastructuresDomainSharedModule>();
            });

            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Add<InfrastructuresResource>("en")
                    .AddBaseTypes(typeof(BusinessExceptionResource))
                    .AddVirtualJson("/QuickTemplate/Infrastructures/Localization/Infrastructures");
            });

            Configure<AbpExceptionLocalizationOptions>(options =>
            {
                options.MapCodeNamespace("QuickTemplate.Infrastructures", typeof(InfrastructuresResource));
            });
        }
    }
}

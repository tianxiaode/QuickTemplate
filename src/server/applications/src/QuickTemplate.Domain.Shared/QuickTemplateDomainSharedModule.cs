using Generic.Abp.Identity;
using QuickTemplate.Infrastructures;
using QuickTemplate.Localization;
using Volo.Abp.AuditLogging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.IdentityServer;
using Volo.Abp.Localization;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;
using Generic.Abp.IdentityServer;

namespace QuickTemplate;

[DependsOn(
    typeof(AbpAuditLoggingDomainSharedModule),
    typeof(AbpBackgroundJobsDomainSharedModule),
    typeof(AbpFeatureManagementDomainSharedModule),
    typeof(AbpIdentityDomainSharedModule),
    typeof(AbpIdentityServerDomainSharedModule),
    typeof(AbpPermissionManagementDomainSharedModule),
    typeof(AbpSettingManagementDomainSharedModule),
    typeof(GenericAbpIdentityDomainSharedModule),
    typeof(GenericAbpIdentityServerDomainSharedModule),
    typeof(QuickTemplateInfrastructuresDomainSharedModule)
    )]
public class QuickTemplateDomainSharedModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        QuickTemplateGlobalFeatureConfigurator.Configure();
        QuickTemplateModuleExtensionConfigurator.Configure();
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<QuickTemplateDomainSharedModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<QuickTemplateResource>("en")
                .AddBaseTypes(typeof(AbpValidationResource))
                .AddVirtualJson("/Localization/QuickTemplate");

            options.DefaultResourceType = typeof(QuickTemplateResource);
        });


        Configure<AbpExceptionLocalizationOptions>(options =>
        {
            options.MapCodeNamespace("QuickTemplate", typeof(QuickTemplateResource));
        });
    }
}

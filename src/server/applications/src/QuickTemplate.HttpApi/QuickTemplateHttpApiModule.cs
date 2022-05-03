using Generic.Abp.Application;
using Generic.Abp.Enumeration;
using Generic.Abp.ExtResource;
using Generic.Abp.Identity;
using Localization.Resources.AbpUi;
using QuickTemplate.Infrastructures;
using QuickTemplate.Localization;
using Volo.Abp.Account;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.HttpApi;
using Volo.Abp.SettingManagement;

namespace QuickTemplate;

[DependsOn(
    typeof(QuickTemplateApplicationContractsModule),
    typeof(GenericAbpApplicationModule),
    typeof(AbpAccountHttpApiModule),
    typeof(GenericAbpIdentityHttpApiModule),
    typeof(AbpPermissionManagementHttpApiModule),
    typeof(AbpFeatureManagementHttpApiModule),
    typeof(AbpSettingManagementHttpApiModule),
    typeof(GenericAbpEnumerationHttpApiModule),
    typeof(GenericAbpExtResourceHttpApiModule),
    typeof(QuickTemplateInfrastructuresHttpApiModule)
    )]
public class QuickTemplateHttpApiModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        ConfigureLocalization();
    }

    private void ConfigureLocalization()
    {
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<QuickTemplateResource>()
                .AddBaseTypes(
                    typeof(AbpUiResource)
                );
        });
    }
}

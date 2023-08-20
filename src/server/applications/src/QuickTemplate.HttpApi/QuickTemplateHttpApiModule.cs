using Generic.Abp.Application;
using Generic.Abp.Enumeration;
using Generic.Abp.ExtResource;
using Generic.Abp.Identity;
using Generic.Abp.OpenIddict;
using Localization.Resources.AbpUi;
using QuickTemplate.Infrastructures;
using QuickTemplate.Localization;
using Volo.Abp.Account;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.HttpApi;
using Volo.Abp.SettingManagement;

namespace QuickTemplate;

[DependsOn(
    typeof(QuickTemplateApplicationContractsModule),
    typeof(AbpAccountHttpApiModule),
    //typeof(AbpIdentityHttpApiModule),
    typeof(AbpPermissionManagementHttpApiModule),
    typeof(AbpSettingManagementHttpApiModule),
    typeof(GenericAbpEnumerationHttpApiModule),
    typeof(GenericAbpExtResourceHttpApiModule),
    typeof(GenericAbpIdentityHttpApiModule),
    typeof(GenericAbpApplicationModule),
    typeof(GenericAbpOpenIddictHttpApiModule),
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
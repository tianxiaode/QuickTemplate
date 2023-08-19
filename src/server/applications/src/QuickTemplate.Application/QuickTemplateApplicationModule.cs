using Generic.Abp.Enumeration;
using Generic.Abp.ExtResource;
using Generic.Abp.Identity;
using Generic.Abp.IdentityServer;
using QuickTemplate.Infrastructures;
using Volo.Abp.Account;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;

namespace QuickTemplate;

[DependsOn(
    typeof(QuickTemplateDomainModule),
    typeof(AbpAccountApplicationModule),
    typeof(QuickTemplateApplicationContractsModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule),
    typeof(GenericAbpEnumerationApplicationModule),
    typeof(GenericAbpExtResourceApplicationModule),
    typeof(GenericAbpIdentityApplicationModule),
    typeof(GenericAbpIdentityServerApplicationModule),
    typeof(QuickTemplateInfrastructuresApplicationModule)
    )]
public class QuickTemplateApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<QuickTemplateApplicationModule>();
        });
    }
}

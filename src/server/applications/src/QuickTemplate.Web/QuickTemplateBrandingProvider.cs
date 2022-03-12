using Microsoft.Extensions.Localization;
using QuickTemplate.Localization;
using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;

namespace QuickTemplate.Web;

[Dependency(ReplaceServices = true)]
public class QuickTemplateBrandingProvider : DefaultBrandingProvider
{
    private readonly IStringLocalizer<QuickTemplateResource> _localizer;
    public QuickTemplateBrandingProvider(IStringLocalizer<QuickTemplateResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}

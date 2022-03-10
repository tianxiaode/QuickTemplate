using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;

namespace QuickTemplate.Web;

[Dependency(ReplaceServices = true)]
public class QuickTemplateBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "QuickTemplate";
}

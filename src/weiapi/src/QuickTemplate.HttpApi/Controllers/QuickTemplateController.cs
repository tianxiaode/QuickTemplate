using QuickTemplate.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace QuickTemplate.Controllers
{
    /* Inherit your controllers from this class.
     */
    public abstract class QuickTemplateController : AbpController
    {
        protected QuickTemplateController()
        {
            LocalizationResource = typeof(QuickTemplateResource);
        }
    }
}
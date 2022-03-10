using System;
using System.Collections.Generic;
using System.Text;
using QuickTemplate.Localization;
using Volo.Abp.Application.Services;

namespace QuickTemplate;

/* Inherit your application services from this class.
 */
public abstract class QuickTemplateAppService : ApplicationService
{
    protected QuickTemplateAppService()
    {
        LocalizationResource = typeof(QuickTemplateResource);
    }
}

using QuickTemplate.Infrastructures.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace QuickTemplate.Infrastructures
{
    public abstract class InfrastructuresController : AbpController
    {
        protected InfrastructuresController()
        {
            LocalizationResource = typeof(InfrastructuresResource);
        }
    }
}

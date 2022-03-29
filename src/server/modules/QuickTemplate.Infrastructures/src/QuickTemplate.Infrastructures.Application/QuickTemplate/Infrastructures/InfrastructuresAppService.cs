using QuickTemplate.Infrastructures.Localization;
using Volo.Abp.Application.Services;

namespace QuickTemplate.Infrastructures
{
    public abstract class InfrastructuresAppService : ApplicationService
    {
        protected InfrastructuresAppService()
        {
            LocalizationResource = typeof(InfrastructuresResource);
            ObjectMapperContext = typeof(QuickTemplateInfrastructuresApplicationModule);
        }
    }
}

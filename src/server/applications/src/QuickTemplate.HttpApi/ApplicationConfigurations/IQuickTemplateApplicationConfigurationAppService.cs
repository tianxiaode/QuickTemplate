using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.ApplicationConfigurations;

namespace QuickTemplate.ApplicationConfigurations;

public interface IQuickTemplateApplicationConfigurationAppService: IAbpApplicationConfigurationAppService
{
    Task<ApplicationLocalizationConfigurationDto> GetLocalizationAsync();

}
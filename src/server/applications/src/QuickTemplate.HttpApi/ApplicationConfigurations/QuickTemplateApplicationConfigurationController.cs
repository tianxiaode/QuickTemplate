using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.AntiForgery;
using Volo.Abp.AspNetCore.Mvc.ApplicationConfigurations;
using Volo.Abp.Auditing;
using Volo.Abp.DependencyInjection;

namespace QuickTemplate.ApplicationConfigurations;


[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(AbpApplicationConfigurationController), IncludeSelf = true)]
[DisableAuditing]
[ControllerName("Configuration")]
[Route("api")]

public class QuickTemplateApplicationConfigurationController: AbpApplicationConfigurationController
{
    private readonly IQuickTemplateApplicationConfigurationAppService _quickTemplateApplicationConfigurationAppService;

    public QuickTemplateApplicationConfigurationController(
        IQuickTemplateApplicationConfigurationAppService quickTemplateApplicationConfigurationAppService, 
        IAbpAntiForgeryManager antiForgeryManager) : base(quickTemplateApplicationConfigurationAppService, antiForgeryManager)
    {
        _quickTemplateApplicationConfigurationAppService = quickTemplateApplicationConfigurationAppService;
    }

    [Area("QuickTemplate")]
    [RemoteService(Name = "QuickTemplate")]
    [HttpGet]
    [Route("application-configuration")]
    public override Task<ApplicationConfigurationDto> GetAsync()
    {
        return  _quickTemplateApplicationConfigurationAppService.GetAsync();
    }

    [HttpGet]
    [RemoteService(isEnabled:true)]
    [Route("localization")]
    public Task<ApplicationLocalizationConfigurationDto> GetLocalizationAsync()
    {
        return  _quickTemplateApplicationConfigurationAppService.GetLocalizationAsync();
    }
}
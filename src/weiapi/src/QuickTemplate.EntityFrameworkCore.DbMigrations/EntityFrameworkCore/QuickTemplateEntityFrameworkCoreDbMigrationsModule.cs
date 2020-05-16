using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Modularity;

namespace QuickTemplate.EntityFrameworkCore
{
    [DependsOn(
        typeof(QuickTemplateEntityFrameworkCoreModule)
        )]
    public class QuickTemplateEntityFrameworkCoreDbMigrationsModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<QuickTemplateMigrationsDbContext>();
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using QuickTemplate.Infrastructures.Districts;
using QuickTemplate.Infrastructures.EntityFrameworkCore.Districts;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.DependencyInjection;
using Volo.Abp.Modularity;

namespace QuickTemplate.Infrastructures.EntityFrameworkCore
{
    [DependsOn(
        typeof(QuickTemplateInfrastructuresDomainModule),
        typeof(AbpEntityFrameworkCoreModule)
    )]
    public class QuickTemplateInfrastructuresEntityFrameworkCoreModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<InfrastructuresDbContext>(options =>
            {
                /* Add custom repositories here. Example:
                 * options.AddRepository<Question, EfCoreQuestionRepository>();
                 */
                options.AddRepository<District, DistrictRepository>();
            });

            Configure<AbpEntityOptions>(options =>
            {
                options.Entity<District>(entityOptions =>
                {
                    entityOptions.DefaultWithDetailsFunc = query => query.Include(m=>m.Parent);
                });
            });
        }
    }
}
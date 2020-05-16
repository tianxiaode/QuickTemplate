using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QuickTemplate.Data;
using Volo.Abp.DependencyInjection;

namespace QuickTemplate.EntityFrameworkCore
{
    [Dependency(ReplaceServices = true)]
    public class EntityFrameworkCoreQuickTemplateDbSchemaMigrator 
        : IQuickTemplateDbSchemaMigrator, ITransientDependency
    {
        private readonly QuickTemplateMigrationsDbContext _dbContext;

        public EntityFrameworkCoreQuickTemplateDbSchemaMigrator(QuickTemplateMigrationsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task MigrateAsync()
        {
            await _dbContext.Database.MigrateAsync();
        }
    }
}
using Microsoft.EntityFrameworkCore;
using QuickTemplate.Infrastructures.Districts;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace QuickTemplate.Infrastructures.EntityFrameworkCore
{
    [ConnectionStringName(InfrastructuresDbProperties.ConnectionStringName)]
    public class InfrastructuresDbContext : AbpDbContext<InfrastructuresDbContext>, IInfrastructuresDbContext
    {
        /* Add DbSet for each Aggregate Root here. Example:
         * public DbSet<Question> Questions { get; set; }
         */

        public DbSet<District> Districts { get; set; }
        public InfrastructuresDbContext(DbContextOptions<InfrastructuresDbContext> options) 
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ConfigureInfrastructures();
        }
    }
}
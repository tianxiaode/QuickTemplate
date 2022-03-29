using Microsoft.EntityFrameworkCore;
using QuickTemplate.Infrastructures.Districts;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace QuickTemplate.Infrastructures.EntityFrameworkCore
{
    [ConnectionStringName(InfrastructuresDbProperties.ConnectionStringName)]
    public interface IInfrastructuresDbContext : IEfCoreDbContext
    {
        /* Add DbSet for each Aggregate Root here. Example:
         * DbSet<Question> Questions { get; }
         */

        DbSet<District> Districts { get; set; }
    }
}
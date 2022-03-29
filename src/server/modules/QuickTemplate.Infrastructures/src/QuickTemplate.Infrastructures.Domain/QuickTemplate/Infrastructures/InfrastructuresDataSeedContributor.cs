using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace QuickTemplate.Infrastructures;

public class InfrastructuresDataSeedContributor: IDataSeedContributor, ITransientDependency
{
    protected IInfrastructuresDataSeed InfrastructuresDataSeed { get; }

    public InfrastructuresDataSeedContributor(IInfrastructuresDataSeed infrastructuresDataSeed)
    {
        InfrastructuresDataSeed = infrastructuresDataSeed;
    }

    public virtual async Task SeedAsync(DataSeedContext context)
    {
        await InfrastructuresDataSeed.SeedAsync();
    }

}
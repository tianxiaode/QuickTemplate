using System.Threading.Tasks;

namespace QuickTemplate.Infrastructures;

public interface IInfrastructuresDataSeed
{
    Task SeedAsync();
}
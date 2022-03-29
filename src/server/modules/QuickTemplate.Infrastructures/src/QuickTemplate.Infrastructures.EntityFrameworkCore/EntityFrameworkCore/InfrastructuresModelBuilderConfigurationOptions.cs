using JetBrains.Annotations;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace QuickTemplate.Infrastructures.EntityFrameworkCore
{
    public class InfrastructuresModelBuilderConfigurationOptions : AbpModelBuilderConfigurationOptions
    {
        public InfrastructuresModelBuilderConfigurationOptions(
            [NotNull] string tablePrefix = "",
            [CanBeNull] string schema = null)
            : base(
                tablePrefix,
                schema)
        {

        }
    }
}
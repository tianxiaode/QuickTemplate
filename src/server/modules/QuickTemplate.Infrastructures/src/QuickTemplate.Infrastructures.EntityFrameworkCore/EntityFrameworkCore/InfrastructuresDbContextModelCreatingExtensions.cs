using Generic.Abp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using QuickTemplate.Infrastructures.Districts;
using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace QuickTemplate.Infrastructures.EntityFrameworkCore
{
    public static class InfrastructuresDbContextModelCreatingExtensions
    {
        public static void ConfigureInfrastructures(
            this ModelBuilder builder,
            Action<InfrastructuresModelBuilderConfigurationOptions> optionsAction = null)
        {
            Check.NotNull(builder, nameof(builder));

            var options = new InfrastructuresModelBuilderConfigurationOptions(
                InfrastructuresDbProperties.DbTablePrefix,
                InfrastructuresDbProperties.DbSchema
            );

            optionsAction?.Invoke(options);
            var jsonSetting = new JsonSerializerSettings {NullValueHandling = NullValueHandling.Ignore};

            builder.Entity<District>(b =>
            {
                //Configure table & schema name
                b.ToTable(options.TablePrefix + "Districts", options.Schema);

                b.ConfigureByConvention();

                //Properties
                b.Property(m => m.DisplayName).IsRequired().HasMaxLength(DistrictConsts.DisplayNameMaxLength)
                    .UseCollation("gbk_chinese_ci");
                b.Property(m => m.Postcode).IsRequired().HasMaxLength(DistrictConsts.PostcodeMaxLength).UseCollation("ascii_general_ci");
                b.Property(m => m.Code).IsRequired().HasMaxLength(TreeConsts.CodeMaxLength).UseCollation("ascii_general_ci");

                //Relations
                b.HasOne<District>(m => m.Parent).WithMany(m => m.Children).HasForeignKey(m => m.ParentId)
                    .IsRequired(false);

                //Indexes
                b.HasIndex(m => m.Code);
                b.HasIndex(m => m.Postcode);
                b.HasIndex(m => m.DisplayName);
                b.HasIndex(m => m.ParentId);

            });



            /* Configure all entities here. Example:

            builder.Entity<Question>(b =>
            {
                //Configure table & schema name
                b.ToTable(options.TablePrefix + "Questions", options.Schema);
            
                b.ConfigureByConvention();
            
                //Properties
                b.Property(q => q.Title).IsRequired().HasMaxLength(QuestionConsts.MaxTitleLength);
                
                //Relations
                b.HasMany(question => question.Tags).WithOne().HasForeignKey(qt => qt.QuestionId);

                //Indexes
                b.HasIndex(q => q.CreationTime);
            });
            */
        }
    }
}
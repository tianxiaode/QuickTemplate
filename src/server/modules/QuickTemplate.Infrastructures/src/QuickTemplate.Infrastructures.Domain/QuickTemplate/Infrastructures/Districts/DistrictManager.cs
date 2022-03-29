using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Generic.Abp.BusinessException.Exceptions;
using Generic.Abp.Domain.Trees;
using JetBrains.Annotations;
using Microsoft.Extensions.Localization;
using QuickTemplate.Infrastructures.Localization;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Settings;
using Volo.Abp.Threading;
using Volo.Abp.Validation;

namespace QuickTemplate.Infrastructures.Districts;

public class DistrictManager: TreeManager<District,IDistrictRepository>
{
    protected readonly IStringLocalizer<InfrastructuresResource> Localizer;
    protected readonly ISettingProvider SettingProvider;

    public DistrictManager(
        IDistrictRepository repository, 
        [NotNull] [ItemNotNull] ITreeCodeGenerator<District> treeCodeGenerator, 
        [NotNull] ICancellationTokenProvider cancellationTokenProvider, 
        IStringLocalizer<InfrastructuresResource> localizer, 
        ISettingProvider settingProvider) : base(repository, treeCodeGenerator, cancellationTokenProvider)
    {
        Localizer = localizer;
        SettingProvider = settingProvider;
    }

    public override async Task ValidateAsync(District entity)
    {
        var siblings = (await FindChildrenAsync(entity.ParentId))
            .Where(m => m.Id != entity.Id)
            .ToList();

        if (siblings.Any(ou => ou.DisplayName == entity.DisplayName))
        {
            throw new DuplicateWarningBusinessException(Localizer[nameof(District)], entity.DisplayName);
        }

        await CheckDuplicateAsync(entity);
    }

    public virtual async Task CheckDuplicateAsync(District entity)
    {
        if (await Repository.AnyAsync(m =>
                m.Postcode.Equals(entity.Postcode, StringComparison.InvariantCultureIgnoreCase) && m.Id != entity.Id))
            throw new DuplicateWarningBusinessException(Localizer[nameof(District)], entity.Postcode);
    }

}
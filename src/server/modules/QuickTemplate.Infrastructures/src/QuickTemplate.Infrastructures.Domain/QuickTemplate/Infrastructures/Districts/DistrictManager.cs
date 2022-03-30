using Generic.Abp.BusinessException.Exceptions;
using Generic.Abp.Domain.Trees;
using JetBrains.Annotations;
using Microsoft.Extensions.Localization;
using QuickTemplate.Infrastructures.Localization;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace QuickTemplate.Infrastructures.Districts;

public class DistrictManager: TreeManager<District,IDistrictRepository>
{
    protected IStringLocalizer<InfrastructuresResource> Localizer { get; }

    public DistrictManager(
        IDistrictRepository repository, 
        [NotNull] ITreeCodeGenerator<District> treeCodeGenerator, 
        [NotNull] ICancellationTokenProvider cancellationTokenProvider, 
        IStringLocalizer<InfrastructuresResource> localizer) : base(repository, treeCodeGenerator, cancellationTokenProvider)
    {
        Localizer = localizer;
    }

    public override async Task ValidateAsync(District entity)
    {
        var siblings = (await FindChildrenAsync(entity.ParentId))
            .Where(m => m.Id != entity.Id)
            .ToList();

        if (siblings.Any(m => m.DisplayName == entity.DisplayName))
        {
            throw new DuplicateWarningBusinessException(Localizer[nameof(District)], entity.DisplayName);
        }

        if (siblings.Any(m => m.Postcode == entity.Postcode))
        {
            throw new DuplicateWarningBusinessException(Localizer["District:Postcode"], entity.Postcode);
        }

    }


}
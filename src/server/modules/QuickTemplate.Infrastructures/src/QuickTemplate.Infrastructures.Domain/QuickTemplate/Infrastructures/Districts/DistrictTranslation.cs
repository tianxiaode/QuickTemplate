using System;
using Generic.Abp.Domain.Entities;
using JetBrains.Annotations;

namespace QuickTemplate.Infrastructures.Districts;

[Serializable]
public class DistrictTranslation: TranslationEntity, IDistrictTranslation
{
    public virtual string DisplayName { get; set; }

    protected DistrictTranslation([NotNull] string language) : base(language)
    {
    }

    public DistrictTranslation([NotNull] string language, string displayName) : base(language)
    {
        DisplayName = displayName;
    }
}
using Generic.Abp.Domain.Entities;
using JetBrains.Annotations;
using System;

namespace QuickTemplate.Infrastructures.Districts;

[Serializable]
public class DistrictTranslation: Translation
{
    public virtual string DisplayName { get; protected set; }

    protected DistrictTranslation([NotNull] string language) : base(language)
    {
    }

    public DistrictTranslation([NotNull] string language, string displayName) : base(language)
    {
        DisplayName = displayName;
    }
}
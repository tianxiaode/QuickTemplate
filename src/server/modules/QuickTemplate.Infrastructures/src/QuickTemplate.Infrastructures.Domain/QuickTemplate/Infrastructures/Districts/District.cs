using System;
using System.Collections.Generic;
using Generic.Abp.Domain.Entities;
using Generic.Abp.Domain.Entities.Auditing;
using Generic.Abp.Domain.Trees;
using Volo.Abp;

namespace QuickTemplate.Infrastructures.Districts;

public class District: GenericFullAuditedAggregateRootWithTranslation<DistrictTranslation>,IDistrict,ITree<District>
{
    public string Code { get; set; }
    public Guid? ParentId { get; set; }
    public string DisplayName { get; set; }
    public string Postcode { get; protected set; }
    public bool IsMunicipality { get; protected set; }
    public virtual District Parent { get; set; }
    public virtual ICollection<District> Children { get; set; }

    public District(Guid id, string displayName, string postcode, Guid? parentId = null, bool isMunicipality = false) : base(id)
    {
        Check.NotNullOrEmpty(displayName, nameof(DisplayName));
        Check.NotNullOrEmpty(postcode, nameof(Postcode));

        DisplayName = displayName;
        Postcode = postcode;
        ParentId = parentId;
        IsMunicipality = isMunicipality;
    }

    public virtual void UpdateDisplayName(string displayName)
    {
        Check.NotNullOrEmpty(displayName, nameof(DisplayName));
        DisplayName = displayName;
    }

    public virtual void UpdatePostcode(string postcode)
    {
        Check.NotNullOrEmpty(postcode, nameof(Postcode));
        Postcode = postcode;
    }

    public virtual void UpdateIsMunicipality(bool isMunicipality)
    {
        IsMunicipality = isMunicipality;
    }

    public virtual void AddTranslation(string language, string displayName)
    {
        Check.NotNullOrWhiteSpace(language, nameof(language));
        Check.NotNullOrWhiteSpace(displayName, nameof(displayName));

        if (IsInTranslation(language))
        {
            var entity = GetTranslation(language);
            if (entity == null) return;
            entity.DisplayName = displayName;
            return;
        }

        Translations.Add(new DistrictTranslation(language, displayName));
    }


}
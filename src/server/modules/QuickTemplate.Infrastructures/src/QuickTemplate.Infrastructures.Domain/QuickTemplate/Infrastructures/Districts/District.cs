using Generic.Abp.Domain.Entities.Auditing;
using Generic.Abp.Domain.Trees;
using System;
using System.Collections.Generic;
using Volo.Abp;

namespace QuickTemplate.Infrastructures.Districts;

[Serializable]
public class District: GenericAuditedAggregateRootWithTranslation,ITree<District>
{
    public string Code { get; set; }
    public Guid? ParentId { get; set; }
    public string DisplayName { get; set; }
    public string Postcode { get; protected set; }
    public virtual District Parent { get; set; }
    public virtual ICollection<District> Children { get; set; }

    public District(Guid id, string displayName, string postcode, Guid? parentId = null) : base(id)
    {
        Check.NotNullOrEmpty(displayName, nameof(DisplayName));
        Check.NotNullOrEmpty(postcode, nameof(Postcode));

        DisplayName = displayName;
        Postcode = postcode;
        ParentId = parentId;
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

}
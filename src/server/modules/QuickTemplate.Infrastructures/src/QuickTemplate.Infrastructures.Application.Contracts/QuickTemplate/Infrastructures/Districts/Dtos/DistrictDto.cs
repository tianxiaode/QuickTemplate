using System;
using System.Collections.Generic;
using System.Linq;
using Generic.Abp.Domain.Extensions;
using Volo.Abp.Application.Dtos;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictDto : ExtensibleAuditedEntityDto<Guid>
    {
        public string Code { get; set; }
        public string Postcode { get; set; }
        public string DisplayName { get; set; }
        public Guid? ParentId { get; set; }
        public bool Leaf { get; set; }
        public DistrictDto Parent { get; set; }
        public List<DistrictTranslationDto> Translations { get; set; }
        public List<DistrictDto> Children { get; set; }
        public DistrictDto()
        {
            Leaf = true;
            Children = null;
        }

        public DistrictDto(District entity, bool leaf)
        {
            Id = entity.Id;
            Code = entity.Code;
            Postcode = entity.Postcode;
            DisplayName = entity.DisplayName;
            ParentId = entity.ParentId;
            Leaf = leaf;
            Children = null;
            Translations = entity.GetTranslations<District, DistrictTranslation>()
                .Select(m => new DistrictTranslationDto(m.Language, m.DisplayName)).ToList();
            if(entity.Parent == null) return;
            Parent = new DistrictDto(entity.Parent, false);
        }

    }
}

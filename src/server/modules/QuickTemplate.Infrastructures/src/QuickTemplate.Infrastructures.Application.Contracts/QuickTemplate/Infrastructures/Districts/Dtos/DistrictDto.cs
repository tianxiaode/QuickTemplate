using Generic.Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Volo.Abp.Application.Dtos;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictDto : EntityDto<Guid>, IDistrict
    {
        public string Code { get; set; }
        public string Postcode { get; set; }
        public string DisplayName { get; set; }
        public Guid? ParentId { get; set; }
        public bool IsMunicipality { get; set; }
        public bool Leaf { get; set; }
        public DistrictDto Parent { get; set; }
        public List<DistrictTranslationDto> Translations { get; set; }

        public DistrictDto()
        {
            Leaf = true;
        }

        public DistrictDto(District entity, bool leaf)
        {
            Id = entity.Id;
            Code = entity.Code;
            Postcode = entity.Postcode;
            DisplayName = entity.DisplayName;
            ParentId = entity.ParentId;
            IsMunicipality = entity.IsMunicipality;
            Leaf = leaf;
            var local = CultureInfo.CurrentCulture.Name;
            Translations = entity.Translations
                .Select(m => new DistrictTranslationDto(m.Language, m.DisplayName)).ToList();
            if(entity.Parent == null) return;
            Parent = new DistrictDto(entity.Parent, false);
        }
    }
}

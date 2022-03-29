using System;
using Generic.Abp.Domain.Entities;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictTranslationUpdateDto : IDistrictTranslation
    {
        public string Language { get; set; }
        public string DisplayName { get; set;}
    }
}

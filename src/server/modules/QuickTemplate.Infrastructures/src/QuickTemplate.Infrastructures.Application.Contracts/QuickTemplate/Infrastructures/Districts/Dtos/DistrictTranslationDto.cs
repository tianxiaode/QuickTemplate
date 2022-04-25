using System;
using Generic.Abp.Domain.Entities.MultiLingual;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictTranslationDto : ITranslation
    {
        public string Language { get; set; }
        public string DisplayName { get; set; }
        public DistrictTranslationDto() { }

        public DistrictTranslationDto(string language, string displayName)
        {
            Language = language;
            DisplayName = displayName;
        }
    }
}

using Generic.Abp.Domain.Entities;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    public class DistrictTranslationDto : IDistrictTranslation
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

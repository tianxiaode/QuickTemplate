using System;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictTranslationUpdateDto 
    {
        public string Language { get; set; }
        public string DisplayName { get; set;}
    }
}

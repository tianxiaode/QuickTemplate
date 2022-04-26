using System;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictUpdateDto:DistrictCreateOrUpdateDto
    {
        public string ConcurrencyStamp { get; set; }
    }
}
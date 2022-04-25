using System;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictGetListInput
    {
        public Guid? Node { get; set; }

        public string Filter { get; set; }

    }
}

using System;
using System.Collections.Generic;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictGetListInput
    {
        public Guid? Node { get; set; }

        public string Filter { get; set; }

    }
}

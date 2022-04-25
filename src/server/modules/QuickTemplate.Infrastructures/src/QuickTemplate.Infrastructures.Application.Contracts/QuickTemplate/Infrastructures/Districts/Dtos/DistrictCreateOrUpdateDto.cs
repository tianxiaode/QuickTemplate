using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Generic.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace QuickTemplate.Infrastructures.Districts.Dtos
{
    [Serializable]
    public class DistrictCreateOrUpdateDto
    {
        [Required]
        [DynamicMaxLength(typeof(DistrictConsts), nameof(DistrictConsts.PostcodeMaxLength))]
        [DisplayName("District:Postcode")]
        public string Postcode { get; set; }

        [Required]
        [DynamicMaxLength(typeof(DistrictConsts), nameof(DistrictConsts.DisplayNameMaxLength))]
        [DisplayName("District:DisplayName")]
        public string DisplayName { get; set;}

        [Required]
        [DisplayName("District:ParentName")]
        public Guid ParentId { get; set;}

    }
}
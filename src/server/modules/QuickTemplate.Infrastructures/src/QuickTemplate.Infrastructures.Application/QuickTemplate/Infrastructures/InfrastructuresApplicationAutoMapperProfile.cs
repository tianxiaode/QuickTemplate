using System.Linq;
using AutoMapper;
using Generic.Abp.Domain.Extensions;
using QuickTemplate.Infrastructures.Districts;
using QuickTemplate.Infrastructures.Districts.Dtos;
using Volo.Abp.AutoMapper;

namespace QuickTemplate.Infrastructures
{
    public class InfrastructuresApplicationAutoMapperProfile : Profile
    {
        public InfrastructuresApplicationAutoMapperProfile()
        {
            /* You can configure your AutoMapper mapping configuration here.
             * Alternatively, you can split your mapping configurations
             * into multiple profile classes for a better organization. */

            CreateMap<District, DistrictDto>()
                .ForMember(m => m.Leaf, opts => opts.MapFrom(m => true))
                .ForMember(m => m.Translations,
                    opts => opts.MapFrom(m => m.GetTranslations<District, DistrictTranslation>()));

            CreateMap<DistrictTranslation, DistrictTranslationDto>();
            CreateMap<DistrictTranslationDto, DistrictTranslation>();
        }
    }
}
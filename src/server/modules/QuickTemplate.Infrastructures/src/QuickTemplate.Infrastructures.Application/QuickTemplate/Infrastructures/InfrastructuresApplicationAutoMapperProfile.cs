using System.Linq;
using AutoMapper;
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
                .ForMember(m => m.Translations,
                    opts => opts.MapFrom(m =>
                        m.Translations.Select(n => new DistrictTranslationDto(n.Language, n.DisplayName))))
                .ForMember(m => m.Leaf, opts => opts.MapFrom(m => true));

        }
    }
}
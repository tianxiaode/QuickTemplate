using AutoMapper;
using Generic.Abp.Domain.Extensions;
using QuickTemplate.Identity.Roles;
using QuickTemplate.Identity.Users;
using System;
using Volo.Abp.Identity;

namespace QuickTemplate;

public class QuickTemplateApplicationAutoMapperProfile : Profile
{
    public QuickTemplateApplicationAutoMapperProfile()
    {
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */

        CreateMap<IdentityRole, RoleDto>()
            .ForMember(m => m.Permissions, opts => opts.Ignore())
            .ForMember(m => m.Translations,
                opts => opts.MapFrom(m => m.GetTranslations<IdentityRole, RoleTranslation>()));

        CreateMap<RoleTranslation, RoleTranslationDto>();

        CreateMap<Tuple<IdentityRole, bool>, UserGetRoleDto>()
            .ForMember(m => m.IsSelected, opts => opts.MapFrom(m => m.Item2))
            .ForMember(m => m.Id, opts => opts.MapFrom(m => m.Item1.Id))
            .ForMember(m => m.Name, opts => opts.MapFrom(m => m.Item1.Name))
            .ForMember(m => m.IsDefault, opts => opts.MapFrom(m => m.Item1.IsDefault))
            .ForMember(m => m.IsPublic, opts => opts.MapFrom(m => m.Item1.IsPublic))
            .ForMember(m => m.IsStatic, opts => opts.MapFrom(m => m.Item1.IsStatic))
            .ForMember(m => m.ConcurrencyStamp, opts => opts.MapFrom(m => m.Item1.ConcurrencyStamp))
            .ForMember(m => m.Permissions, opts => opts.Ignore())
            .ForMember(m => m.Translations,
            opts => opts.MapFrom(m => m.Item1.GetTranslations<IdentityRole, RoleTranslation>()));

    }
}

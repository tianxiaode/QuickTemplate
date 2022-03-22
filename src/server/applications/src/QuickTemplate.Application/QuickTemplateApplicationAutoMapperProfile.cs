using AutoMapper;
using QuickTemplate.Identity.Roles;
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
            .ForMember(m=>m.Permissions, opts=>opts.Ignore())
            .MapExtraProperties();
    }
}

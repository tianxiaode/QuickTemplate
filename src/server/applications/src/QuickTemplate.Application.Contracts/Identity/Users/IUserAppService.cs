using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using QuickTemplate.Identity.Roles;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Users;

public interface IUserAppService
{
    Task<IdentityUserDto> GetAsync(Guid id);
    Task<PagedResultDto<IdentityUserDto>> GetListAsync(GetIdentityUsersInput input);
    Task<ListResultDto<IdentityRoleDto>> GetRolesAsync(Guid id);
    Task<ListResultDto<RoleDto>> GetAssignableRolesAsync();
    Task<IdentityUserDto> CreateAsync(IdentityUserCreateDto input);
    Task<IdentityUserDto> UpdateAsync(Guid id, IdentityUserUpdateDto input);
    Task<ListResultDto<IdentityUserDto>> DeleteAsync(List<Guid> ids);
    Task AddRoleAsync(Guid id, Guid roleId);
    Task RemoveRoleAsync(Guid id, Guid roleId);
    Task SetActiveAsync(Guid id, bool value);
    Task SetLockoutEnabledAsync(Guid id, bool value);
    Task<DateTimeOffset?> SetLockoutAsync(Guid id, bool value);
    Task<IdentityUserDto> FindByUsernameAsync(string username);
    Task<IdentityUserDto> FindByEmailAsync(string email);
}
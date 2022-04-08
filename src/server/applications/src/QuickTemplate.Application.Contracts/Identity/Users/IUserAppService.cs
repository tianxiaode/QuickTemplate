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
    Task<PagedResultDto<UserGetRoleDto>> GetRolesAsync(Guid id, UserGetRolesInput input);
    Task<IdentityUserDto> CreateAsync(UserCreateDto input);
    Task<IdentityUserDto> UpdateAsync(Guid id, UserUpdateDto input);
    Task<ListResultDto<IdentityUserDto>> DeleteAsync(List<Guid> ids);
    Task AddRoleAsync(Guid id, Guid roleId);
    Task RemoveRoleAsync(Guid id, Guid roleId);
    Task SetActiveAsync(Guid id, bool value);
    Task SetLockoutEnabledAsync(Guid id, bool value);
    Task<DateTimeOffset?> SetLockoutAsync(Guid id, bool value);
    Task<IdentityUserDto> FindByUsernameAsync(string username);
    Task<IdentityUserDto> FindByEmailAsync(string email);
}
﻿using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using QuickTemplate.Enumerations;
using QuickTemplate.Identity.Roles;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Identity;
using Volo.Abp.Identity.Settings;
using Volo.Abp.ObjectExtending;
using Volo.Abp.SettingManagement;
using Volo.Abp.Settings;
using IdentityRole = Volo.Abp.Identity.IdentityRole;
using IdentityUser  = Volo.Abp.Identity.IdentityUser;

namespace QuickTemplate.Identity.Users;

[RemoteService(false)]
public class UserAppService: QuickTemplateAppService, IUserAppService
{
    protected IdentityUserManager UserManager { get; }
    protected IIdentityUserRepository UserRepository { get; }
    public IRoleRepository RoleRepository { get; }

    public UserAppService(
        IdentityUserManager userManager,
        IIdentityUserRepository userRepository,
        IRoleRepository roleRepository)
    {
        UserManager = userManager;
        UserRepository = userRepository;
        RoleRepository = roleRepository;
    }

    //TODO: [Authorize(IdentityPermissions.Users.Default)] should go the IdentityUserAppService class.
    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<IdentityUserDto> GetAsync(Guid id)
    {
        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(
            await UserManager.GetByIdAsync(id)
        );
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<PagedResultDto<IdentityUserDto>> GetListAsync(GetIdentityUsersInput input)
    {
        var count = await UserRepository.GetCountAsync(input.Filter);
        var list = await UserRepository.GetListAsync(input.Sorting, input.MaxResultCount, input.SkipCount, input.Filter);

        return new PagedResultDto<IdentityUserDto>(
            count,
            ObjectMapper.Map<List<IdentityUser>, List<IdentityUserDto>>(list)
        );
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<PagedResultDto<UserGetRoleDto>> GetRolesAsync(Guid id, UserGetRolesInput input)
    {
        //TODO: Should also include roles of the related OUs.

        var roles = await UserRepository.GetRolesAsync(id);
        var roleIds = roles.Select(m => m.Id).ToList();

        Expression<Func<IdentityRole, bool>> predicate = input.Type == SelectedOrNot.Selected.Value
            ? m => roleIds.Contains(m.Id)
            : input.Type == SelectedOrNot.Not.Value
                ? m => !roleIds.Contains(m.Id)
                : null;

        var totalCount = await RoleRepository.GetCountAsync(input.Filter, predicate);

        var list = await RoleRepository.GetListAsync(input.Sorting, input.MaxResultCount, input.SkipCount, input.Filter,
            predicate);

        var dtos = list.Select(identityRole =>
            ObjectMapper.Map<Tuple<IdentityRole, bool>, UserGetRoleDto>(
                new Tuple<IdentityRole, bool>(identityRole, roleIds.Contains(identityRole.Id)))).ToList();

        return new PagedResultDto<UserGetRoleDto>(totalCount, dtos.ToList());
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<ListResultDto<RoleDto>> GetAssignableRolesAsync()
    {
        var list = await RoleRepository.GetListAsync();
        return new ListResultDto<RoleDto>(
            ObjectMapper.Map<List<IdentityRole>, List<RoleDto>>(list));
    }

    [Authorize(IdentityPermissions.Users.Create)]
    public virtual async Task<IdentityUserDto> CreateAsync(UserCreateDto input)
    {
        var user = new IdentityUser(
            GuidGenerator.Create(),
            input.UserName,
            input.Email,
            CurrentTenant.Id
        );

        input.MapExtraPropertiesTo(user);

        (await UserManager.CreateAsync(user, input.Password)).CheckErrors();
        await UpdateUserByInput(user, input);

        await CurrentUnitOfWork.SaveChangesAsync();

        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(user);
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task<IdentityUserDto> UpdateAsync(Guid id, UserUpdateDto input)
    {
        var user = await UserManager.GetByIdAsync(id);
        user.ConcurrencyStamp = input.ConcurrencyStamp;

        (await UserManager.SetUserNameAsync(user, input.UserName)).CheckErrors();

        await UpdateUserByInput(user, input);
        input.MapExtraPropertiesTo(user);

        (await UserManager.UpdateAsync(user)).CheckErrors();

        if (!input.Password.IsNullOrEmpty())
        {
            (await UserManager.RemovePasswordAsync(user)).CheckErrors();
            (await UserManager.AddPasswordAsync(user, input.Password)).CheckErrors();
        }

        await CurrentUnitOfWork.SaveChangesAsync();

        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(user);
    }

    [Authorize(IdentityPermissions.Users.Delete)]
    public virtual async Task<ListResultDto<IdentityUserDto>> DeleteAsync(List<Guid> ids)
    {
        if (ids.Contains(CurrentUser.Id.Value))
        {
            throw new BusinessException(code: IdentityErrorCodes.UserSelfDeletion);
        }

        var dtos = new List<IdentityUserDto>();
        foreach (var guid in ids)
        {
            var user = await UserManager.FindByIdAsync(guid.ToString());
            if (user == null)
            {
                continue;
            }
            (await UserManager.DeleteAsync(user)).CheckErrors();
            dtos.Add(ObjectMapper.Map<IdentityUser, IdentityUserDto>(user));
            
        }

        return new ListResultDto<IdentityUserDto>(dtos);
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task AddRoleAsync(Guid id, Guid roleId)
    {
        var user = await UserManager.GetByIdAsync(id);
        var role = await RoleRepository.GetAsync(roleId);
        (await UserManager.AddToRoleAsync(user, role.Name)).CheckErrors();
        await UserRepository.UpdateAsync(user);
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task RemoveRoleAsync(Guid id, Guid roleId)
    {
        var user = await UserManager.GetByIdAsync(id);
        var role = await RoleRepository.GetAsync(roleId);
        (await UserManager.RemoveFromRoleAsync(user, role.Name)).CheckErrors();
        await UserRepository.UpdateAsync(user);
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task SetActiveAsync(Guid id, bool value)
    {
        var entity = await UserManager.GetByIdAsync(id);
        entity.SetIsActive(value);
        (await UserManager.UpdateAsync(entity)).CheckErrors();
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task SetLockoutEnabledAsync(Guid id, bool value)
    {
        var entity = await UserManager.GetByIdAsync(id);
        (await UserManager.SetLockoutEnabledAsync(entity, value)).CheckErrors();
        (await UserManager.UpdateAsync(entity)).CheckErrors();
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task<DateTimeOffset?> SetLockoutAsync(Guid id, bool value)
    {
        var entity = await UserManager.GetByIdAsync(id);
        var duration = await SettingProvider.GetAsync<int>(IdentitySettingNames.Lockout.LockoutDuration);
        DateTimeOffset? time = value ? Clock.Now.AddMinutes(duration) : null;
        (await UserManager.SetLockoutEndDateAsync(entity, time)).CheckErrors();
        (await UserManager.UpdateAsync(entity)).CheckErrors();
        return time;
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<IdentityUserDto> FindByUsernameAsync(string username)
    {
        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(
            await UserManager.FindByNameAsync(username)
        );
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<IdentityUserDto> FindByEmailAsync(string email)
    {
        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(
            await UserManager.FindByEmailAsync(email)
        );
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task UpdateNameAsync(Guid id, string name)
    {
        var entity = await UserManager.GetByIdAsync(id);
        entity.Name = name;
        (await UserManager.UpdateAsync(entity)).CheckErrors();
    }

    protected virtual async Task UpdateUserByInput(IdentityUser user, IdentityUserCreateOrUpdateDtoBase input)
    {
        if (!string.Equals(user.Email, input.Email, StringComparison.InvariantCultureIgnoreCase))
        {
            (await UserManager.SetEmailAsync(user, input.Email)).CheckErrors();
        }

        if (!string.Equals(user.PhoneNumber, input.PhoneNumber, StringComparison.InvariantCultureIgnoreCase))
        {
            (await UserManager.SetPhoneNumberAsync(user, input.PhoneNumber)).CheckErrors();
        }

        //(await UserManager.SetTwoFactorEnabledAsync(user, input.TwoFactorEnabled)).CheckErrors();
        (await UserManager.SetLockoutEnabledAsync(user, input.LockoutEnabled)).CheckErrors();

        user.Name = input.Name;
        user.Surname = input.Surname;

        if (input.RoleNames != null)
        {
            (await UserManager.SetRolesAsync(user, input.RoleNames)).CheckErrors();
        }
    }


}
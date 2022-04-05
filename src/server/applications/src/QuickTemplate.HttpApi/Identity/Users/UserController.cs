using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QuickTemplate.Controllers;
using QuickTemplate.Identity.Roles;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Users;

[Area("identity")]
[ControllerName("Users")]
[Route("api/users")]

public class UserController: QuickTemplateController,IUserAppService
{
    public UserController(IUserAppService userAppService)
    {
        _userAppService = userAppService;
    }

    private IUserAppService _userAppService { get; }

    [HttpGet]
    [Route("{id:guid}")]
    public Task<IdentityUserDto> GetAsync(Guid id)
    {
        return _userAppService.GetAsync(id);
    }
    
    [HttpGet]
    public Task<PagedResultDto<IdentityUserDto>> GetListAsync(GetIdentityUsersInput input)
    {
        return _userAppService.GetListAsync(input);
    }

    [HttpGet]
    [Route("{id:guid}/roles")]
    public Task<ListResultDto<IdentityRoleDto>> GetRolesAsync(Guid id)
    {
        return _userAppService.GetRolesAsync(id);
    }

    [HttpGet]
    [Route("assignable-roles")]
    public Task<ListResultDto<RoleDto>> GetAssignableRolesAsync()
    {
        return _userAppService.GetAssignableRolesAsync();
    }

    [HttpPost]
    public Task<IdentityUserDto> CreateAsync([FromBody]IdentityUserCreateDto input)
    {
        return _userAppService.CreateAsync(input);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public Task<IdentityUserDto> UpdateAsync(Guid id, [FromBody] IdentityUserUpdateDto input)
    {
        return _userAppService.UpdateAsync(id, input);
    }

    [HttpDelete]
    public Task<ListResultDto<IdentityUserDto>> DeleteAsync([FromBody] List<Guid> ids)
    {
        return _userAppService.DeleteAsync(ids);
    }

    [HttpPatch]
    [Route("{id:guid}/role/{roleId:guid}")]
    public Task AddRoleAsync(Guid id, Guid roleId)
    {
        return _userAppService.AddRoleAsync(id, roleId);
    }

    [HttpDelete]
    [Route("{id:guid}/role/{roleId:guid}")]
    public Task RemoveRoleAsync(Guid id, Guid roleId)
    {
        return _userAppService.RemoveRoleAsync(id, roleId);
    }

    [HttpPatch]
    [Route("{id:guid}/active/{value:bool}")]
    public Task SetActiveAsync(Guid id, bool value)
    {
        return _userAppService.SetActiveAsync(id, value);
    }

    [HttpPatch]
    [Route("{id:guid}/lockout-enable/{value:bool}")]
    public Task SetLockoutEnabledAsync(Guid id, bool value)
    {
        return _userAppService.SetLockoutEnabledAsync(id, value);
    }

    [HttpPatch]
    [Route("{id:guid}/lockout/{value:bool}")]
    public Task<DateTimeOffset?> SetLockoutAsync(Guid id, bool value)
    {
        return _userAppService.SetLockoutAsync(id, value);
    }

    [HttpGet]
    [Route("by-username/{userName}")]
    public Task<IdentityUserDto> FindByUsernameAsync(string username)
    {
        return _userAppService.FindByUsernameAsync(username);
    }

    [HttpGet]
    [Route("by-email/{email}")]
    public Task<IdentityUserDto> FindByEmailAsync(string email)
    {
        return _userAppService.FindByEmailAsync(email);
    }
}
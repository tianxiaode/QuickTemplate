using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QuickTemplate.Controllers;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Roles;

[Area("identity")]
[ControllerName("Role")]
[Route("api/roles")]
public class RoleController: QuickTemplateController
{
    private readonly IRoleAppService _roleAppService;

    public RoleController(IRoleAppService roleAppService)
    {
        _roleAppService = roleAppService;
    }

    [HttpGet]
    [Route("{id}")]
    public   virtual Task<RoleDto> GetAsync(Guid id)
    {
        return _roleAppService.GetAsync(id);
    }
    
    [HttpGet]
    [Route("all")]
    public  virtual Task<ListResultDto<RoleDto>> GetAllListAsync()
    {
        return _roleAppService.GetAllListAsync();
    }
    
    [HttpGet]
    public  virtual Task<PagedResultDto<RoleDto>> GetListAsync(GetIdentityRolesInput input)
    {
        return _roleAppService.GetListAsync(input);
    }
    
    [HttpPost]
    public virtual Task<RoleDto> CreateAsync(RoleCreateDto input)
    {
        return _roleAppService.CreateAsync(input);
    }
    
    [HttpPut]
    [Route("{id}")]
    public virtual Task<RoleDto> UpdateAsync(Guid id, RoleUpdateDto input)
    {
        return _roleAppService.UpdateAsync(id, input);
    }
    
    [HttpDelete]
    public Task<ListResultDto<RoleDto>> DeleteAsync([FromBody]List<Guid> ids)
    {
        return _roleAppService.DeleteAsync(ids);
    }
}
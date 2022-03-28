﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Roles;

public interface IRoleAppService
{
    Task<RoleDto> GetAsync(Guid id);
    Task<ListResultDto<RoleDto>> GetAllListAsync();
    Task<PagedResultDto<RoleDto>> GetListAsync(GetIdentityRolesInput input);
    Task<RoleDto> CreateAsync(RoleCreateDto input);
    Task<RoleDto> UpdateAsync(Guid id, RoleUpdateDto input);
    Task<ListResultDto<RoleDto>> DeleteAsync(List<Guid> ids);
    Task SetDefaultAsync(Guid id, bool value);
    Task SetPublicAsync(Guid id, bool value);

}
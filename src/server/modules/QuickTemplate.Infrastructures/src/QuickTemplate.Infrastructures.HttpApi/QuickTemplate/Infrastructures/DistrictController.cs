using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QuickTemplate.Infrastructures.Districts;
using QuickTemplate.Infrastructures.Districts.Dtos;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace QuickTemplate.Infrastructures;

[RemoteService(Name = InfrastructuresRemoteServiceConsts.RemoteServiceName)]
[Area("infrastructures")]
[Route("api/districts")]
public class DistrictController: InfrastructuresController, IDistrictAppService
{
    public DistrictController(IDistrictAppService districtAppService)
    {
        DistrictAppService = districtAppService;
    }

    protected IDistrictAppService DistrictAppService { get;}
    [HttpGet]
    [Route("root")]
    public Task<DistrictDto> GetRootAsync()
    {
        return DistrictAppService.GetRootAsync();
    }

    [HttpGet]
    [Route("{id:guid}")]
    public Task<DistrictDto> GetAsync(Guid id)
    {
        return DistrictAppService.GetAsync(id);
    }

    [HttpGet]
    public Task<ListResultDto<DistrictDto>> GetListAsync(DistrictGetListInput input)
    {
        return DistrictAppService.GetListAsync(input);
    }

    [HttpPost]
    public Task<DistrictDto> CreateAsync([FromBody] DistrictCreateDto input)
    {
        return DistrictAppService.CreateAsync(input);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public Task<DistrictDto> UpdateAsync(Guid id,[FromBody] DistrictUpdateDto input)
    {
        return DistrictAppService.UpdateAsync(id, input);
    }

    [HttpDelete]
    public Task<ListResultDto<DistrictDto>> DeleteAsync([FromBody] List<Guid> ids)
    {
        return DistrictAppService.DeleteAsync(ids);
    }

    [HttpGet]
    [Route("{id:guid}/translations")]
    public Task<ListResultDto<DistrictTranslationDto>> GetTranslationListAsync(Guid id)
    {
        return DistrictAppService.GetTranslationListAsync(id);
    }

    [HttpPut]
    [Route("{id:guid}/translations")]
    public Task UpdateTranslationAsync(Guid id, List<DistrictTranslationUpdateDto> input)
    {
        return DistrictAppService.UpdateTranslationAsync(id, input);
    }


}
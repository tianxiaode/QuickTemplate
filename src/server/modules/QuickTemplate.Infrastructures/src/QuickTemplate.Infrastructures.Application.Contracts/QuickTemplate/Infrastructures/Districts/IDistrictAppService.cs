using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using QuickTemplate.Infrastructures.Districts.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace QuickTemplate.Infrastructures.Districts;

public interface IDistrictAppService: IApplicationService
{
    Task<DistrictDto> GetRootAsync();
    Task<ListResultDto<DistrictDto>> GetListAsync(DistrictGetListInput input);
    Task<DistrictDto> GetAsync(Guid id);
    Task<DistrictDto> CreateAsync(DistrictCreateDto input);
    Task<DistrictDto> UpdateAsync(Guid id, DistrictUpdateDto input);
    Task<ListResultDto<DistrictDto>> DeleteAsync(List<Guid> ids);
    Task<ListResultDto<DistrictTranslationDto>> GetTranslationListAsync(Guid id);
    Task UpdateTranslationAsync(Guid id, List<DistrictTranslationUpdateDto> input);
}
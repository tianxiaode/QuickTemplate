using Generic.Abp.BusinessException;
using Generic.Abp.BusinessException.Exceptions;
using Generic.Abp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using QuickTemplate.Infrastructures.Districts.Dtos;
using QuickTemplate.Infrastructures.Permissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;

namespace QuickTemplate.Infrastructures.Districts;

public class DistrictAppService : InfrastructuresAppService, IDistrictAppService
{
    public DistrictAppService(IDistrictRepository repository, DistrictManager districtManager)
    {
        Repository = repository;
        DistrictManager = districtManager;
    }

    protected IDistrictRepository Repository { get; }
    protected DistrictManager DistrictManager { get; }

    [Authorize(InfrastructuresPermissions.Districts.Default)]
    public virtual async Task<DistrictDto> GetRootAsync()
    {
        var entity = await Repository.FirstOrDefaultAsync(m => m.Postcode == DistrictConsts.RootCode);
        var dto = ObjectMapper.Map<District, DistrictDto>(entity);
        dto.Leaf = false;
        return dto;
    }

    [Authorize(InfrastructuresPermissions.Districts.Default)]
    [UnitOfWork]
    public virtual async Task<ListResultDto<DistrictDto>> GetListAsync(DistrictGetListInput input)
    {
        if (!string.IsNullOrEmpty(input.Filter))
        {
            return new ListResultDto<DistrictDto>(await GetFilterListAsync(input.Filter));
        }

        var list = await Repository.GetListAsync(m => m.ParentId == input.Node.Value, true);
            
        var dtos = new List<DistrictDto>();
        foreach (var district in list.OrderBy(m => m.DisplayName))
        {
            dtos.Add(new DistrictDto(district, !await Repository.HasChildAsync(district.Id)));
        }

        return new ListResultDto<DistrictDto>(dtos);

    }

    [Authorize(InfrastructuresPermissions.Districts.Default)]
    public virtual async Task<DistrictDto> GetAsync(Guid id)
    {
        var entity = await Repository.GetAsync(id);
        var dto = new DistrictDto(entity, true);
        return dto;
    }

    [Authorize(InfrastructuresPermissions.Districts.Create)]
    [UnitOfWork(true)]
    public virtual async Task<DistrictDto> CreateAsync(DistrictCreateDto input)
    {
        var parent = await Repository.GetAsync(input.ParentId, false);
        var entity = new District(GuidGenerator.Create(), input.DisplayName, input.Postcode, parent.Id,
            input.IsMunicipality);
        await DistrictManager.CreateAsync(entity);
        await CurrentUnitOfWork.SaveChangesAsync();
        return new DistrictDto(entity, true);
    }

    [Authorize(InfrastructuresPermissions.Districts.Update)]
    [UnitOfWork(true)]
    public virtual async Task<DistrictDto> UpdateAsync(Guid id, DistrictUpdateDto input)
    {
        var entity = await Repository.GetAsync(id);
        entity.UpdateDisplayName(input.DisplayName);
        entity.UpdatePostcode(input.Postcode);
        entity.UpdateIsMunicipality(input.IsMunicipality);
        await DistrictManager.UpdateAsync(entity);
        await CurrentUnitOfWork.SaveChangesAsync();
        var dto = new DistrictDto(entity, !await Repository.HasChildAsync(entity.Id));
        return dto;
    }

    [Authorize(InfrastructuresPermissions.Districts.Delete)]
    [UnitOfWork]
    public virtual async Task<ListResultDto<DistrictDto>> DeleteAsync(List<Guid> ids)
    {
        var first = ids.FirstOrDefault();
        var entity = await Repository.GetAsync(first);

        if (await Repository.HasChildAsync(first))
        {
            throw new HasChildrenCanNotDeletedBusinessException(nameof(District), entity.DisplayName);
        }

        await Repository.DeleteAsync(entity, true);
        return new ListResultDto<DistrictDto>(new List<DistrictDto>()
            {new(entity, true)});
    }

    [Authorize(InfrastructuresPermissions.Districts.Default)]
    [UnitOfWork]
    public virtual async Task<ListResultDto<DistrictTranslationDto>> GetTranslationListAsync(Guid id)
    {
        var entity = await Repository.GetAsync(id);
        var list = entity.Translations.ToList();
        return new ListResultDto<DistrictTranslationDto>(
            ObjectMapper.Map<List<DistrictTranslation>, List<DistrictTranslationDto>>(list));
    }

    [Authorize(InfrastructuresPermissions.Districts.Update)]
    [UnitOfWork]
    public virtual async Task UpdateTranslationAsync(Guid id, List<DistrictTranslationUpdateDto> input)
    {

        CheckTranslationInput(input);

        var entity = await Repository.GetAsync(id);
        foreach (var dto in input)
        {
            if (string.IsNullOrWhiteSpace(dto.DisplayName))
            {
                entity.RemoveTranslation(dto.Language);
                continue;
            }

            entity.AddTranslation(dto.Language, dto.DisplayName);
        }

        await CurrentUnitOfWork.SaveChangesAsync();
    }

    [UnitOfWork]
    protected virtual void CheckTranslationInput(List<DistrictTranslationUpdateDto> input)
    {
        var checkList = input.Where(m => !string.IsNullOrWhiteSpace(m.DisplayName));
        var errors = input
            .Where(m => !string.IsNullOrWhiteSpace(m.DisplayName) &&
                        m.DisplayName.Length > DistrictConsts.DisplayNameMaxLength).Select(m =>
                L[BusinessExceptionErrorCodes.ValueExceedsFieldLength].Value
                    .Replace(BusinessExceptionErrorCodes.ValueExceedsFieldLengthParamValue, m.DisplayName).Replace(
                        BusinessExceptionErrorCodes.ValueExceedsFieldLengthParamLength,
                        DistrictConsts.DisplayNameMaxLength.ToString())).ToList();


        if (errors.Any()) throw new UserFriendlyException(string.Join("<br>", errors));

    }

    [UnitOfWork]
    protected virtual async Task<List<DistrictDto>> GetFilterListAsync(string filter)
    {
        var codes = await Repository.GetCodeListAsync(filter);
        if (!codes.Any()) return new List<DistrictDto>();
        var ln = TreeConsts.GetCodeLength(2);
        var level2Codes = codes.Where(m => m.Length >= ln).Select(m => m[..ln]).Distinct().ToList();
        var list = await Repository.GetListAsync(m => level2Codes.Contains(m.Code));
        var dtos = list.Select(m => new DistrictDto(m, true)).ToList();
        await GetChildrenAsync(codes, dtos, ln);
        return dtos;
    }

    [UnitOfWork]
    protected virtual async Task GetChildrenAsync(List<string> codes, List<DistrictDto> dtos, int ln)
    {
        var next = ln + TreeConsts.CodeUnitLength + 1;
        var childCodes = codes.Where(m => m.Length >= next).Select(m => m[..next]).Distinct().ToList();
        if(!childCodes.Any()) return;
        var allChildren = await Repository.GetListAsync(m => childCodes.Contains(m.Code));
        foreach (var dto in dtos)
        {
            var children = allChildren.Where(m => m.Code.StartsWith(dto.Code)).ToList();
            if(!children.Any())
            {
                continue;
            }

            dto.Children = children.Select(m=>new DistrictDto(m, true)).ToList();
            dto.Leaf = false;
            await GetChildrenAsync(codes, dto.Children, next);
        }

    }

}
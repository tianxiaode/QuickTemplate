using Generic.Abp.Domain.Entities;
using Generic.Abp.Domain.Extensions;
using Microsoft.Extensions.Logging;
using QuickTemplate.Infrastructures.Districts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Uow;

namespace QuickTemplate.Infrastructures;

public class InfrastructuresDataSeed: ITransientDependency, IInfrastructuresDataSeed
{
    public InfrastructuresDataSeed(
        IGuidGenerator guidGenerator, 
        DistrictManager districtManager, 
        IUnitOfWork currentUnitOfWork, 
        ILogger<InfrastructuresDataSeed> logger)
    {
        GuidGenerator = guidGenerator;
        DistrictManager = districtManager;
        CurrentUnitOfWork = currentUnitOfWork;
        Logger = logger;
    }

    protected IGuidGenerator GuidGenerator { get; }
    protected DistrictManager DistrictManager { get; }
    protected IUnitOfWork CurrentUnitOfWork { get; }
    protected ILogger<InfrastructuresDataSeed> Logger { get; }

    [UnitOfWork(true)]
    public virtual async Task SeedAsync()
    {
            // //增加地区根节点
            var rootDistrict = new District(GuidGenerator.Create(),DistrictConsts.RootName, DistrictConsts.RootCode);
            rootDistrict.SetTranslations(DistrictConsts.RootTranslation.Select(m=>new DistrictTranslation(m.Key,m.Value)));
            await DistrictManager.CreateAsync(rootDistrict);
            Logger.LogInformation($"根节点:{rootDistrict.DisplayName},{rootDistrict.Postcode},{rootDistrict.Code},{rootDistrict.ParentId}");



            //增加中国节点
            var chinaDistrict = new District(GuidGenerator.Create(),DistrictConsts.China, DistrictConsts.ChinaCode, rootDistrict.Id);
            chinaDistrict.SetTranslations(DistrictConsts.ChinaTranslation.Select(m=>new DistrictTranslation(m.Key,m.Value)));
            await DistrictManager.CreateAsync(chinaDistrict);
            Logger.LogInformation($"中国节点:{chinaDistrict.DisplayName},{chinaDistrict.Postcode},{chinaDistrict.Code},{chinaDistrict.ParentId}");


            //增加中国省份
            var dir = Path.Combine(Directory.GetCurrentDirectory(), "data");
            var postCodesLines = await File.ReadAllLinesAsync(Path.Combine(dir, "postcode.csv"));
            var provincialCityCode = new[]{ "11","12","31", "50", "81","82" };
            var postCodeList = new List<District>();
            foreach (var postCodesLine in postCodesLines)
            {
                var postCodeArray = postCodesLine.Replace("\"","").Split(",");
                var postCode = postCodeArray[0];
                Logger.LogInformation($"正在处理：{postCode}");
                Guid parentId;
                var displayName = "";
                if (postCode.EndsWith("0000"))
                {
                    parentId = chinaDistrict.Id;
                    displayName = postCodeArray[1];
                }else
                {
                    var provinceCode = postCode[..2];
                    if(postCode.EndsWith("00"))
                    {
                        var parent = postCodeList.FirstOrDefault(m => m.Postcode.StartsWith(provinceCode));
                        if(parent == null) continue;
                        parentId = parent.Id;
                        displayName = postCodeArray[2];
                    }
                    else
                    {
                        //地区
                        var parent = postCodeList.FirstOrDefault(m => m.Postcode.StartsWith(postCode[..4]));
                        if(parent == null) continue;
                        parentId = parent.Id;
                        displayName = postCodeArray[3];
            
                    }
            
                }
                var entity = new District(GuidGenerator.Create(),displayName, postCode,parentId);
                
                postCodeList.Add(entity);
                await DistrictManager.CreateAsync(entity);
                Logger.LogInformation($"地区节点:{entity.DisplayName},{entity.Postcode},{entity.Code},{entity.ParentId}");
            }
            
    }
}
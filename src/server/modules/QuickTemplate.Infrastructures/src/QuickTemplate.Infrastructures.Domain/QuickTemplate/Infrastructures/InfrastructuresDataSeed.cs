using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Generic.Abp.Domain.Entities;
using QuickTemplate.Infrastructures.Districts;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Uow;

namespace QuickTemplate.Infrastructures;

public class InfrastructuresDataSeed: ITransientDependency, IInfrastructuresDataSeed
{
    public InfrastructuresDataSeed(
        IGuidGenerator guidGenerator, 
        DistrictManager districtManager)
    {
        GuidGenerator = guidGenerator;
        DistrictManager = districtManager;
    }

    protected IGuidGenerator GuidGenerator { get; }
    protected DistrictManager DistrictManager { get; }

    [UnitOfWork(true)]
    public virtual async Task SeedAsync()
    {
            // //增加地区根节点
            var rootDistrict = new District(GuidGenerator.Create(),DistrictConsts.RootName, DistrictConsts.RootCode);
            foreach (var key in DistrictConsts.RootTranslation.Keys)
            {
                rootDistrict.AddTranslation(key, DistrictConsts.RootTranslation[key]);
            }
            await DistrictManager.CreateAsync(rootDistrict);



            //增加中国节点
            var chinaDistrict = new District(GuidGenerator.Create(),DistrictConsts.ChinaCode, DistrictConsts.China, rootDistrict.Id);
            foreach (var key in DistrictConsts.ChinaTranslation.Keys)
            {
                chinaDistrict.AddTranslation(key, DistrictConsts.ChinaTranslation[key]); }
            
            await DistrictManager.CreateAsync(chinaDistrict);
            
            //增加中国省份
            var dir = Path.Combine(Directory.GetCurrentDirectory(), "data");
            var postCodesLines = await File.ReadAllLinesAsync(Path.Combine(dir, "postcode.csv"));
            var provincialCityCode = new[]{ "11","12","31", "50", "81","82" };
            var postCodeList = new List<District>();
            foreach (var postCodesLine in postCodesLines)
            {
                var postCodeArray = postCodesLine.Split(",");
                var postCode = postCodeArray[0];
                Guid parentId;
                var displayName = "";
                var isMunicipalities = false;
                if (postCode.EndsWith("0000"))
                {
                    parentId = chinaDistrict.Id;
                    displayName = postCodeArray[1];
                }else
                {
                    var provinceCode = postCode[..2];
                    if (provincialCityCode.Contains(provinceCode))
                    {
                        var parent = postCodeList.FirstOrDefault(m => m.Postcode.StartsWith(provinceCode));
                        if(parent == null) continue;
                        parentId = parent.Id;
                        displayName = postCodeArray[3];
                        isMunicipalities = true;
                    }
                    else
                    {
                        //城市
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
                            var parent = postCodeList.FirstOrDefault(m => m.Postcode.StartsWith(postCode.Substring(0, 4)));
                            if(parent == null) continue;
                            parentId = parent.Id;
                            displayName = postCodeArray[3];
            
                        }
            
                    }
            
                }
                var entity = new District(GuidGenerator.Create(),postCode,displayName, parentId, isMunicipalities);
                postCodeList.Add(entity);
                await DistrictManager.CreateAsync(entity);
            }
            
    }
}
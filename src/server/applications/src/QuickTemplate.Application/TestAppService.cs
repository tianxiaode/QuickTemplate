using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Generic.Abp.Domain.Entities;
using Microsoft.Extensions.Logging;
using QuickTemplate.Infrastructures.Districts;
using QuickTemplate.Infrastructures.Districts.Dtos;

namespace QuickTemplate;

public class TestAppService : QuickTemplateAppService
{
    public TestAppService(IDistrictRepository repository)
    {
        Repository = repository;
    }

    protected IDistrictRepository Repository { get; }




}

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace QuickTemplate.Infrastructures.Districts;

public interface IDistrictRepository: IRepository<District, Guid>
{
    Task<bool> HasChildAsync(Guid id);
}
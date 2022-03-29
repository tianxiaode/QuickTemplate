using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QuickTemplate.Infrastructures.Districts;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Uow;

namespace QuickTemplate.Infrastructures.EntityFrameworkCore.Districts;

public class DistrictRepository: EfCoreRepository<IInfrastructuresDbContext, District, Guid>,IDistrictRepository
{
    public DistrictRepository(IDbContextProvider<IInfrastructuresDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }


    [UnitOfWork]
    public virtual async Task<bool> HasChildAsync(Guid id)
    {
        return await (await GetQueryableAsync()).AnyAsync(m => m.ParentId == id);
    }



}
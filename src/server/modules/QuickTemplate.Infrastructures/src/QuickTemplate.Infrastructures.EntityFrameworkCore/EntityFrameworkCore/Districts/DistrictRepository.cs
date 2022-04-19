using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
    public virtual async Task<bool> HasChildAsync(Guid id, CancellationToken cancellation = default)
    {
        return await (await GetQueryableAsync()).AnyAsync(m => m.ParentId == id,GetCancellationToken(cancellation));
    }

    [UnitOfWork]
    public virtual async Task<List<District>> GetFilterListAsync(string filter, CancellationToken cancellation = default)
    {
        if (string.IsNullOrEmpty(filter)) return new List<District>();
        var predicate = await BuildFilterPredicateAsync(filter);
        return await GetListAsync(predicate, true, GetCancellationToken(cancellation));
    }

    [UnitOfWork]
    public virtual async Task<List<string>> GetCodeListAsync(string filter, CancellationToken cancellation = default)
    {
        if (string.IsNullOrEmpty(filter)) return new List<string>();
        var predicate = await BuildFilterPredicateAsync(filter);
        var dbSet = await GetDbSetAsync();
        return await dbSet.Where(predicate).Select(m=>m.Code).ToListAsync(GetCancellationToken(cancellation));
    }

    [UnitOfWork]
    protected virtual Task<Expression<Func<District, bool>>> BuildFilterPredicateAsync(string filter)
    {
        Expression<Func<District, bool>> predicate = m => EF.Functions.Like(m.DisplayName, $"%{filter}%");
        if (System.Text.Encoding.UTF8.GetByteCount(filter) == filter.Length)
        {
            predicate = predicate.Or(m => EF.Functions.Like(m.Postcode, $"%{filter}%"));
        }

        return Task.FromResult(predicate);
    }

}
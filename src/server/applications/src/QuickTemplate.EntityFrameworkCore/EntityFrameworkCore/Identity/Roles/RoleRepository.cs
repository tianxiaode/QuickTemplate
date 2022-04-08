using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QuickTemplate.Identity.Roles;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;

namespace QuickTemplate.EntityFrameworkCore.Identity.Roles;

public class RoleRepository: EfCoreIdentityRoleRepository, IRoleRepository
{
    public RoleRepository(IDbContextProvider<IIdentityDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public virtual async Task<List<IdentityRole>> GetListAsync(
        string sorting = null,
        int maxResultCount = int.MaxValue,
        int skipCount = 0,
        string filter = null,
        Expression<Func<IdentityRole,bool>> predicate = null,
        CancellationToken cancellationToken = default)
    {
        return await (await GetQueryableAsync())
            .WhereIf(predicate != null, predicate)
            .WhereIf(!filter.IsNullOrWhiteSpace(),
                x => x.Name.Contains(filter) ||
                     x.NormalizedName.Contains(filter))
            .OrderBy(sorting ?? nameof(IdentityRole.Name))
            .PageBy(skipCount, maxResultCount)
            .ToListAsync(GetCancellationToken(cancellationToken));

    }

    public virtual async Task<int> GetCountAsync(
        string filter = null,
        Expression<Func<IdentityRole,bool>> predicate = null,
        CancellationToken cancellationToken = default)
    {
        return await (await GetQueryableAsync())
            .WhereIf(predicate != null, predicate)
            .WhereIf(!filter.IsNullOrWhiteSpace(),
                x => x.Name.Contains(filter) ||
                     x.NormalizedName.Contains(filter))
            .CountAsync(GetCancellationToken(cancellationToken));

    }

}
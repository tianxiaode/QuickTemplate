using System;
using Generic.Abp.Domain.Entities;
using JetBrains.Annotations;

namespace QuickTemplate.Identity.Roles
{
    [Serializable]
    public class RoleTranslation: Translation
    {
        public virtual string Name { get; protected set; }

        public RoleTranslation([NotNull] string language, string name) : base(language)
        {
            Name = name;
        }
    }
}

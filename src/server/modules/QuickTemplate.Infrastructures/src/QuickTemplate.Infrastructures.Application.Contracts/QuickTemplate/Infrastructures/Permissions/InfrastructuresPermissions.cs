using Volo.Abp.Reflection;

namespace QuickTemplate.Infrastructures.Permissions
{
    public class InfrastructuresPermissions
    {
        public const string GroupName = "Infrastructures";

        public static string[] GetAll()
        {
            return ReflectionHelper.GetPublicConstantsRecursively(typeof(InfrastructuresPermissions));
        }

        public static class Districts
        {
            public const string Default = GroupName + ".Districts";
            public const string Create = Default + ".Create";
            public const string Update = Default + ".Update";
            public const string Delete = Default + ".Delete";
            public const string ManagePermissions = Default + ".ManagePermissions";
        }

    }
}
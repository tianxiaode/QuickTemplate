using QuickTemplate.Infrastructures.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace QuickTemplate.Infrastructures.Permissions
{
    public class InfrastructuresPermissionDefinitionProvider : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var myGroup = context.AddGroup(InfrastructuresPermissions.GroupName, L("Permission:Infrastructures"));

            var districtPermission = myGroup.AddPermission(InfrastructuresPermissions.Districts.Default, L($"Infrastructures.Districts.ManagePermissions"));
            districtPermission.AddChild(InfrastructuresPermissions.Districts.Create, L("Permission:Create"));
            districtPermission.AddChild(InfrastructuresPermissions.Districts.Update, L("Permission:Edit"));
            districtPermission.AddChild(InfrastructuresPermissions.Districts.Delete, L("Permission:Delete"));
            districtPermission.AddChild(InfrastructuresPermissions.Districts.ManagePermissions, L("Permission:ChangePermissions"));

        }

        private static LocalizableString L(string name)
        {
            return LocalizableString.Create<InfrastructuresResource>(name);
        }
    }
}
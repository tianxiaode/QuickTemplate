using QuickTemplate.Localization;
using System.Threading.Tasks;
using Generic.Abp.Metro.UI.Identity.Web.Navigation;
using Volo.Abp.UI.Navigation;

namespace QuickTemplate.Web.Menus;

public class QuickTemplateMenuContributor : IMenuContributor
{
    public async Task ConfigureMenuAsync(MenuConfigurationContext context)
    {
        if (context.Menu.Name == StandardMenus.Main)
        {
            await ConfigureMainMenuAsync(context);
        }
    }

    private Task ConfigureMainMenuAsync(MenuConfigurationContext context)
    {
        var administration = context.Menu.GetAdministration();
        var l = context.GetLocalizer<QuickTemplateResource>();

        context.Menu.Items.Insert(
            0,
            new ApplicationMenuItem(
                QuickTemplateMenus.Home,
                l["Menu:Home"],
                "~/",
                icon: "fas fa-home",
                order: 0
            )
        );

        context.Menu.Items.Add(new ApplicationMenuItem(
            QuickTemplateMenus.About,
            l["Menu:About"],
            "~/About"
        ));

        context.Menu.Items.Add(new ApplicationMenuItem(
            QuickTemplateMenus.Github,
            "Github",
            "https://github.com/tianxiaode/QuickTemplate",
            "fab fa-github"
        ));

        administration.SetSubItemOrder(IdentityMenuNames.GroupName, 2);
        //administration.SetSubItemOrder(SettingManagementMenuNames.GroupName, 3);

        return Task.CompletedTask;
    }
}
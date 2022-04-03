using System;
using System.Collections.Generic;
using Volo.Abp.Data;
using Volo.Abp.Identity;

namespace QuickTemplate.Identity.Roles;

public static class RoleExtensions
{
    private const string TranslationsPropertyName = "Translations";

    public static void SetTranslations(this IdentityRole role, IEnumerable<RoleTranslation> translations)
    {
        role.SetProperty(TranslationsPropertyName, System.Text.Json.JsonSerializer.Serialize(translations));
    }

    public static List<RoleTranslation>  GetTranslations(this IdentityRole role)
    {
        var str = role.GetProperty<string>(TranslationsPropertyName);
        return str.IsNullOrEmpty()
            ? new List<RoleTranslation>()
            : System.Text.Json.JsonSerializer.Deserialize<List<RoleTranslation>>(str);
    }
}
Ext.define('Test.spec.common.core.service.Config', {

    requires: [
        'Common.core.service.Config',
        'Common.core.service.AccessControl'
    ],

    statics: {
        run() {
            describe('Common.core.service.Config', () => {
                let jsonTestData = Test.spec.common.core.service.Config.responseData;

                beforeEach(() => {
                    jasmine.Ajax.install();

                    jasmine.Ajax.stubRequest(
                        /.*configuration/,
                        /.*/
                    ).andReturn({
                        status: 200,
                        contentType: 'application/json',
                        responseText: JSON.stringify(jsonTestData)
                    });
                });

                afterEach(() => {
                    jasmine.Ajax.uninstall();
                })


                describe("验证获取本地化资源", () => {

                    it('验证返回数据', (done) => {
                        Config.loadConfiguration().then((response) => {
                            expect(Config.getCurrentUser().userName).toEqual('admin');
                            expect(Config.getPasswordSetting().requiredLength).toEqual('6');
                        }).catch((err) => {
                            expect(err).toBeFalsy();
                        }).then(done)

                    })
                });
            });

        },

        responseData: {
            "localization": null,
            "auth": {
                "grantedPolicies": {
                    "AbpIdentity.Roles": true,
                    "AbpIdentity.Roles.Create": true,
                    "AbpIdentity.Roles.Update": true,
                    "AbpIdentity.Roles.Delete": true,
                    "AbpIdentity.Roles.ManagePermissions": true,
                    "AbpIdentity.Users": true,
                    "AbpIdentity.Users.Create": true,
                    "AbpIdentity.Users.Update": true,
                    "AbpIdentity.Users.Delete": true,
                    "AbpIdentity.Users.ManagePermissions": true,
                    "AbpIdentity.UserLookup": true,
                    "SettingManagement.Emailing": true,
                    "SettingManagement.Emailing.Test": true,
                    "SettingManagement.PasswordPolicy": true,
                    "SettingManagement.LookupPolicy": true,
                    "OpenIddict.Applications": true,
                    "OpenIddict.Applications.Create": true,
                    "OpenIddict.Applications.Update": true,
                    "OpenIddict.Applications.Delete": true,
                    "OpenIddict.Applications.ManagePermissions": true,
                    "OpenIddict.Scopes": true,
                    "OpenIddict.Scopes.Create": true,
                    "OpenIddict.Scopes.Update": true,
                    "OpenIddict.Scopes.Delete": true,
                    "OpenIddict.Scopes.ManagePermissions": true,
                    "Infrastructures.Districts": true,
                    "Infrastructures.Districts.Create": true,
                    "Infrastructures.Districts.Update": true,
                    "Infrastructures.Districts.Delete": true,
                    "Infrastructures.Districts.ManagePermissions": true,
                    "FeatureManagement.ManageHostFeatures": true
                }
            },
            "setting": {
                "values": {
                    "Abp.Localization.DefaultLanguage": "en",
                    "Abp.Timing.TimeZone": "UTC",
                    "Abp.Identity.Password.RequiredLength": "6",
                    "Abp.Identity.Password.RequiredUniqueChars": "1",
                    "Abp.Identity.Password.RequireNonAlphanumeric": "True",
                    "Abp.Identity.Password.RequireLowercase": "True",
                    "Abp.Identity.Password.RequireUppercase": "True",
                    "Abp.Identity.Password.RequireDigit": "True",
                    "Abp.Identity.Lockout.AllowedForNewUsers": "True",
                    "Abp.Identity.Lockout.LockoutDuration": "300",
                    "Abp.Identity.Lockout.MaxFailedAccessAttempts": "5",
                    "Abp.Identity.SignIn.RequireConfirmedEmail": "False",
                    "Abp.Identity.SignIn.EnablePhoneNumberConfirmation": "True",
                    "Abp.Identity.SignIn.RequireConfirmedPhoneNumber": "False",
                    "Abp.Identity.User.IsUserNameUpdateEnabled": "True",
                    "Abp.Identity.User.IsEmailUpdateEnabled": "True",
                    "Abp.Identity.OrganizationUnit.MaxUserMembershipCount": "2147483647",
                    "Abp.Account.IsSelfRegistrationEnabled": "true",
                    "Abp.Account.EnableLocalLogin": "true"
                }
            },
            "currentUser": {
                "isAuthenticated": false,
                "id": null,
                "tenantId": null,
                "impersonatorUserId": null,
                "impersonatorTenantId": null,
                "impersonatorUserName": null,
                "impersonatorTenantName": null,
                "userName": "admin",
                "name": null,
                "surName": null,
                "email": null,
                "emailVerified": false,
                "phoneNumber": null,
                "phoneNumberVerified": false,
                "roles": []
            },
            "features": {
                "values": {
                    "SettingManagement.Enable": "true",
                    "SettingManagement.AllowChangingEmailSettings": "false"
                }
            },
            "globalFeatures": null,
            "multiTenancy": null,
            "currentTenant": null,
            "timing": {
                "timeZone": {
                    "iana": {
                        "timeZoneName": "Etc/UTC"
                    },
                    "windows": {
                        "timeZoneId": "UTC"
                    }
                }
            },
            "clock": {
                "kind": "Utc"
            },
            "objectExtensions": {
                "modules": {},
                "enums": {}
            },
            "extraProperties": null
        }
    }
})

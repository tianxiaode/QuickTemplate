Ext.define('Test.spec.common.oidc.setting.UserManager', {
    requires: [
        'Common.oidc.setting.UserManager'
    ],

    statics: {
        run() {
            describe("Common.oidc.setting.UserManager", () => {
                describe("constructor", () => {
            
                    it("should pass settings to base class", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });
            
                        // assert
                        expect(subject.clientId).toEqual("client");
                    });
            
                });
            
                describe("popupRedirectUri", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            popupRedirectUri: "test",
                        });
            
                        // assert
                        expect(subject.popupRedirectUri).toEqual("test");
                    });
            
                });
            
                describe("popupWindowFeatures", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            popupWindowFeatures: { status: true },
                        });
            
                        // assert
                        expect(subject.popupWindowFeatures).toEqual({ status: true });
                    });
            
                    it("should set closePopupWindowAfterInMilliseconds", () => {
                        // act
                        const closePopupWindowAfterInSeconds = 100;
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            popupWindowFeatures: { status: true, closePopupWindowAfterInSeconds },
                        });
            
                        // assert
                        expect(subject.popupWindowFeatures).toEqual({ status: true, closePopupWindowAfterInSeconds });
                    });
                });
            
                describe("popupWindowTarget", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            popupWindowTarget: "foo",
                        });
            
                        // assert
                        expect(subject.popupWindowTarget).toEqual("foo");
                    });
            
                });
            
                describe("redirectMethod", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            redirectMethod: "replace",
                        });
            
                        // assert
                        expect(subject.redirectMethod).toEqual("replace");
                    });
            
                });
            
                describe("silent_redirectUri", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            silent_redirectUri: "test",
                        });
            
                        // assert
                        expect(subject.silent_redirectUri).toEqual("test");
                    });
            
                });
            
                describe("silentRequestTimeout", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            silentRequestTimeoutInSeconds: 123,
                        });
            
                        // assert
                        expect(subject.silentRequestTimeoutInSeconds).toEqual(123);
                    });
            
                });
            
                describe("automaticSilentRenew", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            automaticSilentRenew: false,
                        });
            
                        // assert
                        expect(subject.automaticSilentRenew).toEqual(false);
                    });
            
                    it("should use default value", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });
            
                        // assert
                        expect(subject.automaticSilentRenew).toEqual(true);
                    });
            
                });
            
                describe("validateSubOnSilentRenew", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            validateSubOnSilentRenew: false,
                        });
            
                        // assert
                        expect(subject.validateSubOnSilentRenew).toEqual(false);
                    });
            
                    it("should use default value", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });
            
                        // assert
                        expect(subject.validateSubOnSilentRenew).toEqual(true);
                    });
            
                });
            
                describe("includeIdTokenInSilentRenew", () => {
                    it("should return true value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            includeIdTokenInSilentRenew: true,
                        });
            
                        // assert
                        expect(subject.includeIdTokenInSilentRenew).toEqual(true);
                    });
            
                    it("should use default value", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });
            
                        // assert
                        expect(subject.includeIdTokenInSilentRenew).toEqual(false);
                    });
                });
            
                describe("accessTokenExpiringNotificationTime", () => {
            
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            accessTokenExpiringNotificationTimeInSeconds: 10,
                        });
            
                        // assert
                        expect(subject.accessTokenExpiringNotificationTimeInSeconds).toEqual(10);
                    });
            
                    it("should use default value", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });
            
                        // assert
                        expect(subject.accessTokenExpiringNotificationTimeInSeconds).toEqual(60);
                    });
            
                });
            
                describe("userStore", () => {
                    it("should return value from initial settings", () => {
                        const temp = {};
            
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            userStore : temp,
                        });
            
                        // assert
                        expect(subject.userStore).toEqual(temp);
                    });
                });
            
                describe("revokeAccessTokenOnSignout", () => {
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            revokeTokensOnSignout : true,
                        });
            
                        // assert
                        expect(subject.revokeTokensOnSignout).toEqual(true);
                    });
                });
            
                describe("checkSessionInterval", () => {
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            checkSessionIntervalInSeconds: 6,
                        });
            
                        // assert
                        expect(subject.checkSessionIntervalInSeconds).toEqual(6);
                    });
                    it("should use default value", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });
            
                        // assert
                        expect(subject.checkSessionIntervalInSeconds).toEqual(2);
                    });
                });
            
                describe("query_status_response_type", () => {
                    it("should return value from initial settings", () => {
                        const temp = "type";
            
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            queryStatusResponseType : temp,
                        });
            
                        // assert
                        expect(subject.queryStatusResponseType).toEqual(temp);
                    });
                    it("should infer default value", () => {
                        {
                            // act
                            const subject = Ext.create('oidc.setting.usermanager',{
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                                responseType: "id_token token",
                            });
            
                            // assert
                            expect(subject.queryStatusResponseType).toEqual("code");
                        }
                        {
                            // act
                            const subject = Ext.create('oidc.setting.usermanager',{
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                                responseType: "code",
                            });
            
                            // assert
                            expect(subject.queryStatusResponseType).toEqual("code");
                        }
                    });
                });
            
                describe("stopCheckSessionOnError", () => {
                    it("should return value from initial settings", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            stopCheckSessionOnError : false,
                        });
            
                        // assert
                        expect(subject.stopCheckSessionOnError).toEqual(false);
                    });
                    it("should use default value", () => {
                        // act
                        const subject = Ext.create('oidc.setting.usermanager',{
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect"
                        });
            
                        // assert
                        expect(subject.stopCheckSessionOnError).toEqual(true);
                    });
                });
            });
            
        }
    }
});
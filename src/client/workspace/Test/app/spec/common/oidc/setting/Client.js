Ext.define('Test.spec.common.oidc.setting.Client', {
    requires: [
        'Common.oidc.setting.Client'
    ],

    statics: {
        run() {
            describe('Common.oidc.setting.Client', () => {

                describe("clientId", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect"
                        });

                        // assert
                        expect(subject.clientId).toEqual("client");
                    });
                });

                describe("client_secret", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            clientSecret: "secret",
                        });

                        // assert
                        expect(subject.clientSecret).toEqual("secret");
                    });
                });

                describe("response_type", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            responseType: "foo",
                        });

                        // assert
                        expect(subject.responseType).toEqual("foo");
                    });

                    it("should use default value", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect"
                        });

                        // assert
                        expect(subject.responseType).toEqual("code");
                    });

                });

                describe("scope", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            scope: "foo",
                        });

                        // assert
                        expect(subject.scope).toEqual("foo");
                    });

                    it("should use default value", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });

                        // assert
                        expect(subject.scope).toEqual("openid");
                    });

                });

                describe("redirectUri", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://app",
                        });

                        // assert
                        expect(subject.redirectUri).toEqual("http://app");
                    });

                });

                describe("post_logout_redirectUri", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            postLogoutRedirectUri: "http://app/loggedout",
                        });

                        // assert
                        expect(subject.postLogoutRedirectUri).toEqual("http://app/loggedout");
                    });
                });

                describe("prompt", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            prompt: "foo",
                        });

                        // assert
                        expect(subject.prompt).toEqual("foo");
                    });
                });

                describe("display", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            display: "foo",
                        });

                        // assert
                        expect(subject.display).toEqual("foo");
                    });
                });

                describe("max_age", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            maxAge: 22,
                        });

                        // assert
                        expect(subject.maxAge).toEqual(22);
                    });
                });

                describe("ui_locales", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            uiLocales: "foo",
                        });

                        // assert
                        expect(subject.uiLocales).toEqual("foo");
                    });
                });

                describe("acr_values", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            acrValues: "foo",
                        });

                        // assert
                        expect(subject.acrValues).toEqual("foo");
                    });
                });

                describe("resource", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            resource: "foo",
                        });

                        // assert
                        expect(subject.resource).toEqual("foo");
                    });
                });

                describe("response_mode", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            responseMode: "query",
                        });

                        // assert
                        expect(subject.responseMode).toEqual("query");
                    });
                });

                describe("authority", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            clientId: "client",
                            redirectUri: "redirect",
                            authority: "http://sts",
                        });

                        // assert
                        expect(subject.authority).toEqual("http://sts");
                    });
                });

                describe("metadataUrl", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                        });

                        // assert
                        expect(subject.metadataUrl).toEqual("http://sts/metadata");
                    });
                });

                describe("metadata", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: { issuer: "test" },
                        });

                        // assert
                        expect(subject.metadata).toEqual({ issuer: "test" });
                    });
                });

                describe("signingKeys", () => {
                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            signingKeys: [{ kid: "test" }],
                        });

                        // assert
                        expect(subject.signingKeys).toEqual([{ kid: "test" }]);
                    });
                });

                describe("filterProtocolClaims", () => {

                    it("should use default value", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });

                        // assert
                        expect(subject.filterProtocolClaims).toEqual(true);
                    });

                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            filterProtocolClaims: true,
                        });

                        // assert
                        expect(subject.filterProtocolClaims).toEqual(true);

                        // act
                        subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            filterProtocolClaims: false,
                        });

                        // assert
                        expect(subject.filterProtocolClaims).toEqual(false);

                        // act
                        subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            filterProtocolClaims: ["a", "b", "c"],
                        });

                        // assert
                        expect(subject.filterProtocolClaims).toEqual(["a", "b", "c"]);
                    });
                });

                describe("loadUserInfo", () => {

                    it("should use default value", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                        });

                        // assert
                        expect(subject.loadUserInfo).toEqual(false);
                    });

                    it("should return value from initial settings", () => {
                        // act
                        let subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            loadUserInfo: true,
                        });

                        // assert
                        expect(subject.loadUserInfo).toEqual(true);

                        // act
                        subject = Ext.create('oidc.setting.client', {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            loadUserInfo: false,
                        });

                        // assert
                        expect(subject.loadUserInfo).toEqual(false);
                    });

                    describe("staleStateAge", () => {

                        it("should use default value", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                            });

                            // assert
                            expect(subject.staleStateAgeInSeconds).toEqual(900);
                        });

                        it("should return value from initial settings", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                                staleStateAgeInSeconds: 100,
                            });

                            // assert
                            expect(subject.staleStateAgeInSeconds).toEqual(100);
                        });
                    });

                    describe("clockSkew", () => {

                        it("should use default value", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                            });

                            // assert
                            expect(subject.clockSkewInSeconds).toEqual(5 * 60); // 5 mins
                        });

                        it("should return value from initial settings", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                                clockSkewInSeconds: 10,
                            });

                            // assert
                            expect(subject.clockSkewInSeconds).toEqual(10);
                        });
                    });

                    describe("extraQueryParams", () => {

                        it("should use default value", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                            });

                            // assert
                            expect(subject.extraQueryParams).toEqual({});
                        });

                        it("should return value from initial settings", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                                extraQueryParams: {
                                    "hd": "domain.com",
                                },
                            });

                            // assert
                            expect(subject.extraQueryParams).toEqual({ "hd": "domain.com" });
                        });
                    });

                    describe("extraTokenParams", () => {

                        it("should use default value", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect"
                            });

                            // assert
                            expect(subject.extraTokenParams).toEqual({});
                        });

                        it("should return value from initial settings", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                                extraTokenParams: {
                                    "resourceServer": "abc"
                                }
                            });

                            // assert
                            expect(subject.extraTokenParams).toEqual({ "resourceServer": "abc" });
                        });
                    });

                    describe("extraHeaders", () => {

                        it("should use default value", () => {
                            // act
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                            });

                            // assert
                            expect(subject.extraHeaders).toEqual({});
                        });

                        it("should return value from initial settings", () => {
                            // act
                            let extraHeaders = {
                                "Header-1": "this-is-a-test",
                                "Header-3": () => "dynamic header",
                            };
                            let subject = Ext.create('oidc.setting.client', {
                                authority: "authority",
                                clientId: "client",
                                redirectUri: "redirect",
                                extraHeaders: extraHeaders,
                            });

                            // assert
                            expect(subject.extraHeaders).toEqual(extraHeaders);
                        });
                    });

                });

            });

        }
    }

});
Ext.define('Test.spec.common.oidc.MetadataService', {

    requires: [
        'Common.oidc.MetadataService'
    ],

    statics: {
        run() {
            describe('Common.oidc.MetadataService', () => {
                let settings;
                let subject;

                beforeEach(() => {
                    settings = {
                        authority: "authority",
                        clientId: "client",
                        redirectUri: "redirect",
                    };
                    subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                });

                describe("resetSigningKeys", () => {
                    it("should reset signing keys", () => {
                        // arrange
                        subject["signingKeys"] = [{ a: "b" }];

                        // act
                        subject.resetSigningKeys();

                        // assert
                        expect(subject["signingKeys"]).toBeNull();
                    });
                });

                describe("getMetadata", () => {
                    it("should use metadata on settings", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: { issuer: "test" },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        const result = await subject.getMetadata();

                        // assert
                        expect(result).toEqual({ issuer: "test" });
                    });

                    it("should calculate metadataUrl from authority", async () => {
                        // arrange
                        let jsonService = subject["jsonService"]; // access private member
                        spyOn(jsonService, "getJson").and.returnValue({ foo: "bar" });

                        // act
                        await subject.getMetadata();

                        // assert
                        expect(jsonService.getJson).toHaveBeenCalledWith("authority/.well-known/openid-configuration", null, "same-origin");
                    });

                    it("should fail when no authority or metadataUrl configured", async () => {
                        // arrange
                        settings = {
                            authority: "",
                            clientId: "client",
                            redirectUri: "redirect",
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        await expectAsync(subject.getMetadata()).toBeRejectedWith(new Error('No authority or metadataUrl configured on settings'));
                    });

                    it("should use metadataUrl to make json call", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        spyOn(jsonService, "getJson").and.returnValue({ foo: "bar" });

                        // act
                        await subject.getMetadata();

                        // assert
                        expect(jsonService.getJson).toHaveBeenCalledWith("http://sts/metadata", null, "same-origin");
                    });

                    it("should return metadata from json call", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        let json = { "test": "data" };
                        spyOn(jsonService, "getJson").and.returnValue(json);

                        // act
                        const result = await subject.getMetadata();

                        // assert
                        expect(result).toEqual(json);
                    });

                    it("should cache metadata from json call", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        let json = { test: "value" };
                        spyOn(jsonService, "getJson").and.returnValue(json);

                        // act
                        await subject.getMetadata();

                        // assert
                        let metadata = subject["metadata"]; // access private member
                        expect(metadata).toEqual(json);
                    });

                    it("should merge metadata from seed", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                            metadataSeed: { issuer: "one" },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        spyOn(jsonService, "getJson").and.returnValue({ jwks_uri: "two" });

                        // act
                        let result = await subject.getMetadata();

                        // assert
                        expect(result).toEqual({ issuer: "one", jwks_uri: "two" });
                        let metadata = subject["metadata"]; // access private member
                        expect(metadata).toEqual({ issuer: "one", jwks_uri: "two" });
                    });

                    it("should fail if json call fails", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let error = new Error("test");
                        let jsonService = subject["jsonService"]; // access private member
                        spyOn(jsonService, "getJson").and.returnValue(Promise.reject(error));

                        // act
                        await expectAsync(subject.getMetadata()).toBeRejectedWith(error);
                    });

                    it("should use getRequestCredentials to make json call when set", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                            fetchRequestCredentials: "include",
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        spyOn(jsonService, "getJson").and.returnValue({ foo: "bar" });

                        // act
                        await subject.getMetadata();

                        // assert
                        expect(jsonService.getJson).toHaveBeenCalledWith("http://sts/metadata", null, "include");
                    });
                });

                describe("getIssuer", () => {
                    it("should use metadata on settings", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                issuer: "test",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        const result = await subject.getIssuer();

                        // assert
                        expect(result).toEqual("test");
                    });

                    it("should fail if no data on metadata", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        await expectAsync(subject.getIssuer()).toBeRejectedWith(new Error('Metadata does not contain property issuer'));
                    });

                    it("should fail if json call to load metadata fails", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadataUrl: "http://sts/metadata",
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let error = new Error("test");
                        let jsonService = subject["jsonService"]; // access private member
                        spyOn(jsonService, "getJson").and.returnValue(Promise.reject(error));

                        // act
                        await expectAsync(subject.getIssuer()).toBeRejectedWith(error);
                    });

                    it("should return value from", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                issuer: "http://sts",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getIssuer();

                        // assert
                        expect(result).toEqual("http://sts");
                    });
                });

                describe("getAuthorizationEndpoint", () => {
                    it("should return value from metadata", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                authorization_endpoint: "http://sts/authorize",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getAuthorizationEndpoint();

                        // assert
                        expect(result).toEqual("http://sts/authorize");
                    });
                });

                describe("getUserInfoEndpoint", () => {
                    it("should return value from", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                userinfo_endpoint: "http://sts/userinfo",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getUserInfoEndpoint();

                        // assert
                        expect(result).toEqual("http://sts/userinfo");
                    });
                });

                describe("getTokenEndpoint", () => {
                    it("should return value from", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                token_endpoint: "http://sts/tokeninfo",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getTokenEndpoint();

                        // assert
                        expect(result).toEqual("http://sts/tokeninfo");
                    });
                });

                describe("getCheckSessionIframe", () => {
                    it("should return value from", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                check_session_iframe: "http://sts/check_session",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getCheckSessionIframe();

                        // assert
                        expect(result).toEqual("http://sts/check_session");
                    });

                    it("should support optional value", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getCheckSessionIframe();

                        // assert
                        expect(result).toBeUndefined();
                    });
                });

                describe("getEndSessionEndpoint", () => {
                    it("should return value from", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                end_session_endpoint: "http://sts/signout",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getEndSessionEndpoint();

                        // assert
                        expect(result).toEqual("http://sts/signout");
                    });

                    it("should support optional value", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getEndSessionEndpoint();

                        // assert
                        expect(result).toBeUndefined();
                    });
                });

                describe("getRevocationEndpoint", () => {
                    it("should return value from", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                revocation_endpoint: "http://sts/revocation",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getRevocationEndpoint();

                        // assert
                        expect(result).toEqual("http://sts/revocation");
                    });

                    it("should support optional value", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getRevocationEndpoint();

                        // assert
                        expect(result).toBeUndefined();
                    });
                });

                describe("getSigningKeys", () => {
                    it("should use signingKeys on settings", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            signingKeys: [{ kid: "test" }],
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        let result = await subject.getSigningKeys();

                        // assert
                        expect(result).toEqual([{ kid: "test" }]);
                    });

                    it("should fail if metadata does not have jwks_uri", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: { issuer: "test" },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));

                        // act
                        await expectAsync(subject.getSigningKeys()).toBeRejectedWith(new Error("Metadata does not contain property jwks_uri"));
                    });

                    it("should fail if keys missing on keyset from jwks_uri", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                jwks_uri: "http://sts/metadata/keys",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        spyOn(jsonService, "getJson").and.returnValue(Promise.resolve({}));

                        // act
                        await expectAsync(subject.getSigningKeys()).toBeRejectedWith(new Error("Missing keys on keyset"));
                    });

                    it("should make json call to jwks_uri", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                jwks_uri: "http://sts/metadata/keys",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        let json = {
                            keys: [{
                                use: "sig",
                                kid: "test",
                            }],
                        };
                        spyOn(jsonService, "getJson").and.returnValue(Promise.resolve(json));

                        // act
                        await subject.getSigningKeys();

                        // assert
                        expect(jsonService.getJson).toHaveBeenCalledWith("http://sts/metadata/keys");
                    });

                    it("should return keys from jwks_uri", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                jwks_uri: "http://sts/metadata/keys",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        jsonService = subject["jsonService"]; // access private member
                        let expectedKeys = [{
                            use: "sig",
                            kid: "test",
                        }];
                        let json = {
                            keys: expectedKeys,
                        };
                        spyOn(jsonService, "getJson").and.returnValue(Promise.resolve(json));

                        // act
                        let result = await subject.getSigningKeys();

                        // assert
                        expect(result).toEqual(expectedKeys);
                    });

                    it("should cache keys from json call", async () => {
                        // arrange
                        settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            metadata: {
                                jwks_uri: "http://sts/metadata/keys",
                            },
                        };
                        subject = Ext.create('oidc.metadataservice', Ext.create('oidc.clientsettingsstore', settings));
                        let jsonService = subject["jsonService"]; // access private member
                        let expectedKeys = [{
                            use: "sig",
                            kid: "test",
                        }];
                        let json = {
                            keys: expectedKeys,
                        };
                        spyOn(jsonService, "getJson").and.returnValue(Promise.resolve(json));

                        // act
                        await subject.getSigningKeys();

                        // assert
                        let signingKeys = subject["signingKeys"]; // access private member
                        expect(signingKeys).toEqual(expectedKeys);
                    });
                });

            });

        }
    }


});
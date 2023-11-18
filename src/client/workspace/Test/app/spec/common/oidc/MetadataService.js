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
            
            
            });

        }
    }


});
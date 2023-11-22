Ext.define('Test.spec.common.oidc.TokenClient', {

    requires: [
        //'Common.oidc.TokenClient'
    ],


    statics: {
        // run1() {
        //     describe("Common.oidc.TokenClient", () => {
        //         let settings;
        //         let metadataService;
        //         let subject;

        //         beforeEach(() => {
        //             settings = {
        //                 authority: "authority",
        //                 clientId: "client_id",
        //                 redirectUri: "redirectUri",
        //             };
        //             let settingsStore = Ext.create('oidc.clientsettingsstore', settings);
        //             metadataService = Ext.create('oidc.metadataservice', settingsStore);

        //             subject = Ext.create('oidc.tokenclient', { settings: settingsStore, metadataService });
        //         });

        //         describe("exchangeCode", () => {
        //             it("should have clientId", async () => {
        //                 // arrange
        //                 settings.clientId = "";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeCode({ code: "code", codeVerifier: "code_verifier" })).toBeRejectedWithError();
        //             });

        //             it("should have redirectUri", async () => {
        //                 // arrange
        //                 settings.redirectUri = "";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeCode({ code: "code", codeVerifier: "code_verifier" })).toBeRejectedWithError();
        //             });

        //             it("should have code", async () => {
        //                 // act
        //                 await expectAsync(subject.exchangeCode({ code: "", codeVerifier: "code_verifier" })).toBeRejectedWithError();
        //             });

        //             it("should have code_verifier", async () => {
        //                 // act
        //                 await expectAsync(subject.exchangeCode({ code: "code", codeVerifier: "" })).toBeRejectedWithError();
        //             });

        //             it("should have client_secret when using client_secret_basic", async () => {
        //                 // arrange
        //                 delete settings.clientSecret;
        //                 settings.clientAuthentication = "client_secret_basic";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeCode({ code: "code", codeVerifier: "code_verifier" })).toBeRejectedWithError();
        //             });

        //             it("should calculate basic auth when using client_secret_basic", async () => {
        //                 // arrange
        //                 settings.clientAuthentication = "client_secret_basic";
        //                 settings.clientSecret = "client_secret";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});
        //                 let generateBasicAuthSpy = spyOn(Oidc.Crypto, "generateBasicAuth");

        //                 // act
        //                 await subject.exchangeCode({ code: "code", codeVerifier: "code_verifier" });

        //                 // assert
        //                 expect(generateBasicAuthSpy).toHaveBeenCalledWith("client_id", "client_secret");
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);
        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 expect(recent.args[1].size).toBeGreaterThan(0);
        //                 expect(recent.args[2]).toBeUndefined();
        //                 expect(recent.args[3]).toEqual('same-origin');
        //             });

        //             it("should include client secret when using client_secret_post", async () => {
        //                 // arrange
        //                 settings.clientAuthentication = "client_secret_post";
        //                 settings.clientSecret = "client_secret";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.exchangeCode({ code: "code", codeVerifier: "code_verifier" });

        //                 // assert

        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);
        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(params.get('client_secret')).toEqual('client_secret');
        //                 expect(recent.args[2]).toBeUndefined();
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });

        //             it("should call postForm", async () => {
        //                 // arrange
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.exchangeCode({ code: "code", codeVerifier: "code_verifier" });

        //                 // assert
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);

        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(recent.args[2]).toBeUndefined();
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });
        //         });

        //         describe("exchangeCredentials", () => {

        //             it("should have clientId", async () => {
        //                 // arrange
        //                 settings.clientId = "";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeCredentials({ username: "u", password: "p" })).toBeRejectedWithError();
        //             });

        //             it("should have client_secret when using client_secret_basic", async () => {
        //                 // arrange
        //                 delete settings.clientSecret;
        //                 settings.clientAuthentication = "client_secret_basic";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeCredentials({ username: "u", password: "p" })).toBeRejectedWithError();
        //             });

        //             it("should calculate basic auth when using client_secret_basic", async () => {
        //                 // arrange
        //                 settings.clientAuthentication = "client_secret_basic";
        //                 settings.clientSecret = "client_secret";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});
        //                 let generateBasicAuthSpy = spyOn(Oidc.Crypto, "generateBasicAuth").and.callThrough();

        //                 // act
        //                 await subject.exchangeCredentials({ username: "u", password: "p" });

        //                 // assert
        //                 expect(generateBasicAuthSpy).toHaveBeenCalledWith("client_id", "client_secret");
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);

        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(recent.args[2]).toEqual('Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=');
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });

        //             it("should include client secret when using client_secret_post", async () => {
        //                 // arrange
        //                 settings.clientAuthentication = "client_secret_post";
        //                 settings.clientSecret = "client_secret";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.exchangeCredentials({ username: "u", password: "p" });


        //                 // assert
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);
        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(recent.args[1].get('client_secret')).toEqual('client_secret');
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });

        //             it("should call postForm", async () => {
        //                 // arrange
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.exchangeCredentials({ username: "u", password: "p" });

        //                 // assert
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);
        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(recent.args[2]).toBeUndefined();
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });
        //         });

        //         describe("exchangeRefreshToken", () => {
        //             it("should have clientId", async () => {
        //                 // arrange
        //                 settings.clientId = "";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeRefreshToken({ refreshToken: "refresh_token" })).toBeRejectedWithError();
        //             });

        //             it("should have redirectUri", async () => {
        //                 // arrange
        //                 settings.redirectUri = "";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeRefreshToken({ refreshToken: "refresh_token" })).toBeRejectedWithError();
        //             });

        //             it("should have refresh_token", async () => {
        //                 // act
        //                 await expectAsync(subject.exchangeRefreshToken({ refreshToken: "" })).toBeRejectedWithError();
        //             });

        //             it("should have client_secret when using client_secret_basic", async () => {
        //                 // arrange
        //                 delete settings.clientSecret;
        //                 settings.clientAuthentication = "client_secret_basic";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 // act
        //                 await expectAsync(subject.exchangeRefreshToken({ refreshToken: "refresh_token" })).toBeRejectedWithError("A client_secret is required");
        //             });

        //             it("should calculate basic auth when using client_secret_basic", async () => {
        //                 // arrange
        //                 settings.clientAuthentication = "client_secret_basic";
        //                 settings.clientSecret = "client_secret";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.exchangeRefreshToken({ refreshToken: "refresh_token" });

        //                 // assert
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);

        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(recent.args[2]).toEqual('Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=');
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });

        //             it("should include client secret when using client_secret_post", async () => {
        //                 // arrange
        //                 settings.clientAuthentication = "client_secret_post";
        //                 settings.clientSecret = "client_secret";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.exchangeRefreshToken({ refreshToken: "refresh_token" });

        //                 // assert
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);
        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(params.get('client_secret')).toEqual('client_secret');
        //                 expect(recent.args[2]).toBeUndefined();
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });

        //             it("should call postForm", async () => {
        //                 // arrange
        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getTokenEndpoint").and.returnValue("http://sts/token_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.exchangeRefreshToken({ refreshToken: "refresh_token" });

        //                 // assert
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);
        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/token_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);
        //                 expect(recent.args[2]).toBeUndefined();
        //                 expect(recent.args[3]).toEqual('same-origin');

        //             });
        //         });

        //         describe("revoke", () => {
        //             it("should have token", async () => {
        //                 // act
        //                 await expectAsync(subject.revoke({ token: "", token_type_hint: "access_token" })).toBeRejectedWithError();
        //             });

        //             it("should call postForm", async () => {
        //                 // arrange
        //                 settings.clientSecret = "client_secret";
        //                 subject = Ext.create('oidc.tokenclient', { settings: Ext.create('oidc.clientsettingsstore', settings), metadataService });

        //                 let getTokenEndpointMock = spyOn(subject["metadataService"], "getRevocationEndpoint").and.returnValue("http://sts/revoke_endpoint");
        //                 let postFormMock = spyOn(subject["jsonService"], "postForm").and.returnValue({});

        //                 // act
        //                 await subject.revoke({ token: "token", tokenTypeHint: "access_token" });

        //                 // assert
        //                 expect(getTokenEndpointMock).toHaveBeenCalledWith(false);
        //                 let recent = postFormMock.calls.mostRecent();
        //                 expect(postFormMock).toHaveBeenCalled();
        //                 expect(recent.args[0]).toEqual("http://sts/revoke_endpoint");
        //                 let params = recent.args[1];
        //                 expect(params.size).toBeGreaterThan(0);

        //             });
        //         });
        //     });

        // }
    }

});
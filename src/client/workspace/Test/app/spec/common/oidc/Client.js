Ext.define('Test.spec.common.oidc.Client', {
    requires: [
        'Common.oidc.Client',
        'Common.oidc.state.Refresh'

    ],

    statics:{
        run(){
            describe("Common.oidc.Client", () => {
                let subject;
            
                beforeEach(() => {
                    subject = Ext.create('oidc.client', {
                        authority: "authority",
                        clientId: "client",
                        redirectUri: "redirect",
                        postLogoutRedirectUri: "http://app",
                    });
                });
            
                describe("letructor", () => {
                    it("should expose settings", () => {
                        // assert
                        expect(subject.settings).not.toBeNull();
                        expect(subject.settings.clientId).toEqual("client");
                    });
                });
            
                describe("settings", () => {
            
                    it("should be OidcClientSettings", () => {
                        // assert
                        expect(subject.settings).toBeInstanceOf(Common.oidc.setting.Client);
                    });
                });
            
                describe("createSigninRequest", () => {
            
                    it("should return SigninRequest", async () => {
                        // arrange
                        let args = {
                            redirectUri: "redirect",
                            responseType: "code",
                            scope: "scope",
                        };
                        spyOn(subject.metadataService, "getAuthorizationEndpoint").and.resolveTo("http://sts/authorize");
            
                        // act
                        let request = await subject.createSigninRequest(args);
            
                        // assert
                        expect(request).toBeInstanceOf(Common.oidc.request.Signin);
                    });
            
                    it("should pass params to SigninRequest", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getAuthorizationEndpoint").and.resolveTo("http://sts/authorize");
            
                        // act
                        let request = await subject.createSigninRequest({
                            state: "foo",
                            responseType: "code",
                            responseMode: "fragment",
                            scope: "baz",
                            redirectUri: "quux",
                            prompt: "p",
                            display: "d",
                            maxAge: 42,
                            uiLocales: "u",
                            idTokenHint: "ith",
                            loginHint: "lh",
                            acrValues: "av",
                            resource: "res",
                            request: "req",
                            requestUri: "req_uri",
                            nonce: "rnd",
                            urlState: "url_state",
                        });
            
                        // assert
                        expect(request.state.data).toEqual("foo");
                        let url = request.url;
                        expect(url).toContain("http://sts/authorize");
                        expect(url).toContain("response_type=code");
                        expect(url).toContain("scope=baz");
                        expect(url).toContain("redirect_uri=quux");
                        expect(url).toContain("prompt=p");
                        expect(url).toContain("display=d");
                        expect(url).toContain("max_age=42");
                        expect(url).toContain("ui_locales=u");
                        expect(url).toContain("id_token_hint=ith");
                        expect(url).toContain("login_hint=lh");
                        expect(url).toContain("acr_values=av");
                        expect(url).toContain("resource=res");
                        expect(url).toContain("request=req");
                        expect(url).toContain("request_uri=req_uri");
                        expect(url).toContain("response_mode=fragment");
                        expect(url).toContain("nonce=rnd");
                        console.log('url-', url)
                        expect(url.match(/state=.*%3Burl_state/)).toBeTruthy();
                    });
            
                    it("should pass state in place of data to SigninRequest", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getAuthorizationEndpoint").and.callFake(() => Promise.resolve("http://sts/authorize"));
            
                        // act
                        let request = await subject.createSigninRequest({
                            state: "foo",
                            responseType: "code",
                            scope: "baz",
                            redirectUri: "quux",
                            prompt: "p",
                            display: "d",
                            maxAge: 42,
                            uiLocales: "u",
                            idTokenHint: "ith",
                            loginHint: "lh",
                            acrValues: "av",
                            resource: "res",
                            urlState: "url_state",
                        });
            
                        // assert
                        expect(request.state.data).toEqual("foo");
                        let url = request.url;
                        expect(url).toContain("http://sts/authorize");
                        expect(url).toContain("response_type=code");
                        expect(url).toContain("scope=baz");
                        expect(url).toContain("redirect_uri=quux");
                        expect(url).toContain("prompt=p");
                        expect(url).toContain("display=d");
                        expect(url).toContain("max_age=42");
                        expect(url).toContain("ui_locales=u");
                        expect(url).toContain("id_token_hint=ith");
                        expect(url).toContain("login_hint=lh");
                        expect(url).toContain("acr_values=av");
                        expect(url).toContain("resource=res");
                        expect(url.match(/state=.*%3Burl_state/)).toBeTruthy();
                    });
            
                    it("should fail if implicit flow requested", async () => {
                        // arrange
                        let args = {
                            redirectUri: "redirect",
                            scope: "scope",
                            responseType: "id_token",
                        };
            
                        // act
                        try {
                            await subject.createSigninRequest(args);
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("Only the Authorization Code flow");
                        }
                    });
            
                    it("should fail if metadata fails", async () => {
                        // arrange
                        let args = {
                            redirectUri: "redirect",
                            responseType: "code",
                            scope: "scope",
                        };
                        spyOn(subject.metadataService, "getAuthorizationEndpoint").and.rejectWith(new Error("test"));
            
                        // act
                        try {
                            await subject.createSigninRequest(args);
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("test");
                        }
                    });
            
                    it("should fail if setting state into store fails", async () => {
                        // arrange
                        let args = {
                            redirectUri: "redirect",
                            responseType: "code",
                            scope: "scope",
                        };
                        spyOn(subject.metadataService, "getAuthorizationEndpoint").and.resolveTo("http://sts/authorize");
                        spyOn(subject.settings.stateStore, "set").and.rejectWith(new Error("foo"));
            
                        // act
                        try {
                            await subject.createSigninRequest(args);
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("foo");
                        }
                    });
            
                    it("should store state", async () => {
                        // arrange
                        let args = {
                            redirectUri: "redirect",
                            responseType: "code",
                            scope: "scope",
                        };
                        spyOn(subject.metadataService, "getAuthorizationEndpoint").and.callFake(() => Promise.resolve("http://sts/authorize"));
                        let setMock = spyOn(subject.settings.stateStore, "set").and.resolveTo();
            
                        // act
                        await subject.createSigninRequest(args);
            
                        // assert
                        expect(setMock).toHaveBeenCalled();
                    });
                });
            
                describe("readSigninResponseState", () => {
            
                    it("should fail if no state on response", async () => {
                        // arrange
                        spyOn(subject.settings.stateStore, "get").and.resolveTo("state");
            
                        // act
                        try {
                            await subject.readSigninResponseState("http://app/cb");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("state");
                        }
                    });
            
                    it("should fail if storage fails", async () => {
                        // arrange
                        spyOn(subject.settings.stateStore, "get").and.rejectWith(new Error("fail"));
            
                        // act
                        try {
                            await subject.readSigninResponseState("http://app/cb?state=state");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("fail");
                        }
                    });
            
                    it("should deserialize stored state and return state and response", async () => {
                        // arrange
                        let item = await Common.oidc.state.Signin.create({
                            id: "1",
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://app/cb",
                            scope: "scope",
                            requestType: "type",
                        });
                        spyOn(subject.settings.stateStore, "get").and.resolveTo(item.toStorageString());
            
                        // act
                        let { state, response } = await subject.readSigninResponseState("http://app/cb?state=1");
            
                        // assert
                        expect(state.id).toEqual("1");
                        expect(state.authority).toEqual("authority");
                        expect(state.clientId).toEqual("client");
                        expect(state.requestType).toEqual("type");
                        expect(response.state).toEqual("1");
                    });
                });
            
                describe("processSigninResponse", () => {
                    it("should fail if no state on response", async () => {
                        // arrange
                        spyOn(subject.settings.stateStore, "get").and.resolveTo("state");
            
                        // act
                        try {
                            await subject.processSigninResponse("http://app/cb");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("state");
                        }
                    });
            
                    it("should fail if storage fails", async () => {
                        // arrange
                        spyOn(subject.settings.stateStore, "remove").and.rejectWith(new Error("fail"));
            
                        // act
                        try {
                            await subject.processSigninResponse("http://app/cb?state=state");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("fail");
                        }
                    });
            
                    it("should deserialize stored state and call validator", async () => {
                        // arrange
                        let item = await Common.oidc.state.Signin.create({
                            id: "1",
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://app/cb",
                            scope: "scope",
                            requestType: "type",
                        });
                        spyOn(subject.settings.stateStore, "remove").and.callFake(async () => item.toStorageString());
                        let validateSigninResponseMock = spyOn(subject["validator"], "validateSigninResponse");
            
                        // act
                        let response = await subject.processSigninResponse("http://app/cb?state=1");
            
                        // assert
                        expect(validateSigninResponseMock).toHaveBeenCalled();
                        let recent = validateSigninResponseMock.calls.mostRecent();
                        expect(recent.args[0]).toEqual(response);
                        expect(recent.args[1]).toBeInstanceOf(Common.oidc.state.Signin);
                        expect(recent.args[1].id).toEqual(item.id);
                        expect(recent.args[1].authority).toEqual(item.authority);
                        expect(recent.args[1].clientId).toEqual(item.clientId);
                        expect(recent.args[1].redirectUri).toEqual(item.redirectUri);
                        expect(recent.args[1].scope).toEqual(item.scope);
                        expect(recent.args[1].requestType).toEqual(item.requestType);
                    });
                });
            
                describe("processResourceOwnerPasswordCredentials", () => {
            
                    it("should fail on wrong credentials", async () => {
                        // arrange
                        spyOn(subject["tokenClient"], "exchangeCredentials").and.rejectWith(new Error("Wrong credentials"));
            
                        // act
                        await expectAsync(subject.processResourceOwnerPasswordCredentials({ username: "u", password: "p", skipUserInfo: false }))
                            // assert
                            .toBeRejectedWithError('Wrong credentials');
                    });
            
                    it("should fail on invalid response", async () => {
                        // arrange
                        spyOn(subject["tokenClient"], "exchangeCredentials").and.resolveTo({});
                        spyOn(subject["validator"], "validateCredentialsResponse").and.rejectWith(new Error("Wrong response"));
            
                        // act
                        await expectAsync(subject.processResourceOwnerPasswordCredentials({ username: "u", password: "p", skipUserInfo: false }))
                            // assert
                            .toBeRejectedWithError('Wrong response');
                    });
            
                    it("should return response on success", async () => {
                        // arrange
                        spyOn(subject["tokenClient"], "exchangeCredentials").and.resolveTo({
                            accessToken: "access_token",
                            idToken: "id_token",
                            scope: "openid profile email",
                        });
                        spyOn(subject["validator"], "validateCredentialsResponse").and.callFake(
                            async (response) => {
                                Object.assign(response, { profile: { sub: "subsub" } });
                            },
                        );
            
                        // act
                        let signinResponse = await subject.processResourceOwnerPasswordCredentials({ username: "u", password: "p", skipUserInfo: false });
            
                        // assert
                        expect(signinResponse.accessToken).toEqual( "access_token");
                        expect(signinResponse.idToken).toEqual("id_token");
                        expect(signinResponse.scope).toEqual("openid profile email");
                        expect(signinResponse.profile).toEqual({ sub: "subsub" });
                    });
            
                });
            
                describe("useRefreshToken", () => {
                    it("should return a SigninResponse", async () => {
                        // arrange
                        let tokenResponse = {
                            accessToken: "new_access_token",
                            scope: "replacement scope",
                        };
                        spyOn(subject["tokenClient"], "exchangeRefreshToken").and.resolveTo(tokenResponse);
                        let state = Ext.create('oidc.state.refresh', {
                            refreshToken: "refresh_token",
                            idToken: "id_token",
                            sessionState: "session_state",
                            scope: "openid",
                            profile: {}
                        });
            
                        // act
                        let response = await subject.useRefreshToken({ state });
            
                        // assert
                        expect(response).toBeInstanceOf(Common.oidc.response.Signin);
                        expect(response).toEqual(jasmine.objectContaining(tokenResponse));
                    });
            
                    it("should preserve the session_state and scope", async () => {
                        // arrange
                        let tokenResponse = {
                            accessToken: "new_access_token",
                        };
                        let exchangeRefreshTokenMock = spyOn(subject["tokenClient"], "exchangeRefreshToken").and.resolveTo(tokenResponse);
                        spyOn(Oidc.Jwt, "decode").and.returnValue({ sub: "sub" });
                        let state = Ext.create('oidc.state.refresh',{
                            refreshToken: "refresh_token",
                            idToken: "id_token",
                            sessionState: "session_state",
                            scope: "openid",
                            profile: {},
                        }, "resource");
            
                        // act
                        let response = await subject.useRefreshToken({ state });
            
                        // assert
                        expect(exchangeRefreshTokenMock).toHaveBeenCalledWith( {
                            refreshToken: "refresh_token",
                            scope: "openid",
                            timeoutInSeconds: undefined,
                            resource: "resource",
                        });
                        expect(response).toBeInstanceOf(Common.oidc.response.Signin);
                        expect(response).toEqual(jasmine.objectContaining(tokenResponse));
                        expect(response.sessionState).toEqual(state.sessionState);
                        expect(response.scope).toEqual(state.scope);
                    });
            
                    it("should filter allowable scopes", async () => {
                        // arrange
                        let settings = {
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "redirect",
                            postLogoutRedirectUri: "http://app",
                            refreshTokenAllowedScope: "allowed_scope",
                        };
                        subject = Ext.create('oidc.client', settings);
            
                        let tokenResponse = {
                            accessToken: "new_access_token",
                        };
                        let exchangeRefreshTokenMock = spyOn(subject["tokenClient"], "exchangeRefreshToken").and.resolveTo(tokenResponse);
                        spyOn(Oidc.Jwt, "decode").and.returnValue({ sub: "sub" });
                        let state = Ext.create('oidc.state.refresh', {
                            refreshToken: "refresh_token",
                            idToken: "id_token",
                            sessionState: "session_state",
                            scope: "unallowed_scope allowed_scope unallowed_scope_2",
                            profile: {} 
                        });
            
                        // act
                        let response = await subject.useRefreshToken({ state });
            
                        // assert
                        expect(exchangeRefreshTokenMock).toHaveBeenCalledWith( {
                            refreshToken: "refresh_token",
                            scope: "allowed_scope",
                            resource: undefined,
                            timeoutInSeconds: undefined,
                        });
                        expect(response).toBeInstanceOf(Common.oidc.response.Signin);
                        expect(response).toEqual(jasmine.objectContaining(tokenResponse));
                        expect(response.sessionState).toEqual(state.sessionState);
                        expect(response.scope).toEqual("allowed_scope");
                    });
            
                    it("should enforce a matching sub claim", async () => {
                        // arrange
                        let profiles = {
                            id_token: {
                                sub: "current_sub",
                            },
                            new_id_token: {
                                sub: "new_sub",
                            },
                        };
                        let tokenResponse = {
                            accessToken: "new_access_token",
                            idToken: "new_id_token",
                        };
                        spyOn(subject["tokenClient"], "exchangeRefreshToken").and.resolveTo(tokenResponse);
                        spyOn(Oidc.Jwt, "decode").and.callFake((token) =>{ console.log('Oidc.Jwt.decode', token); return profiles[token] });
                        let state = Ext.create('oidc.state.refresh', {
                            refreshToken: "refresh_token",
                            idToken: "id_token",
                            sessionState: "session_state",
                            scope: "openid",
                            profile: {}
                        });
            
                        // act
                        await expectAsync(subject.useRefreshToken({ state }))
                            // assert
                            .toBeRejectedWithError("sub in id_token does not match current sub");
                    });
                });
            
                describe("createSignoutRequest", () => {
                    it("should return SignoutRequest", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve("http://sts/signout"));
            
                        // act
                        let request = await subject.createSignoutRequest({});
            
                        // assert
                        expect(request).toBeInstanceOf(Common.oidc.request.Signout);
                    });
            
                    it("should pass state in place of data to SignoutRequest", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve("http://sts/signout"));
            
                        // act
                        let request = await subject.createSignoutRequest({
                            state: "foo",
                            postLogoutRedirectUri: "bar",
                            idTokenHint: "baz",
                        });
            
                        // assert
                        expect(request.state).toBeDefined();
                        expect(request.state?.data).toEqual("foo");
                        let url = request.url;
                        expect(url).toContain("http://sts/signout");
                        expect(url).toContain("post_logout_redirect_uri=bar");
                        expect(url).toContain("id_token_hint=baz");
                    });
            
                    it("should pass params to SignoutRequest", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve("http://sts/signout"));
            
                        // act
                        let request = await subject.createSignoutRequest({
                            state: "foo",
                            postLogoutRedirectUri: "bar",
                            idTokenHint: "baz",
                        });
            
                        // assert
                        expect(request.state).toBeDefined();
                        expect(request.state?.data).toEqual("foo");
                        let url = request.url;
                        expect(url).toContain("http://sts/signout");
                        expect(url).toContain("post_logout_redirect_uri=bar");
                        expect(url).toContain("id_token_hint=baz");
                    });
            
                    it("should pass params to SignoutRequest w/o id_token_hint and client_id", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve("http://sts/signout"));
            
                        // act
                        let request = await subject.createSignoutRequest({
                            state: "foo",
                            postLogoutRedirectUri: "bar",
                        });
            
                        // assert
                        expect(request.state).toBeDefined();
                        expect(request.state?.data).toEqual("foo");
                        let url = request.url;
                        expect(url).toContain("http://sts/signout");
                        expect(url).toContain("post_logout_redirect_uri=bar");
                        expect(url).toContain("client_id=client");
                    });
            
                    it("should pass params to SignoutRequest with client_id", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve("http://sts/signout"));
            
                        // act
                        let request = await subject.createSignoutRequest({
                            state: "foo",
                            postLogoutRedirectUri: "bar",
                            clientId: "baz",
                        });
            
                        // assert
                        expect(request.state).toBeDefined();
                        expect(request.state?.data).toEqual("foo");
                        let url = request.url;
                        expect(url).toContain("http://sts/signout");
                        expect(url).toContain("post_logout_redirect_uri=bar");
                        expect(url).toContain("client_id=baz");
                    });
            
                    it("should fail if metadata fails", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.rejectWith(new Error("test"));
            
                        // act
                        try {
                            await subject.createSignoutRequest({});
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toContain("test");
                        }
                    });
            
                    it("should fail if no signout endpoint on metadata", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve(undefined));
            
                        // act
                        try {
                            await subject.createSignoutRequest({});
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toContain("No end session endpoint");
                        }
                    });
            
                    it("should store state", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve("http://sts/signout"));
                        let setMock = spyOn(subject.settings.stateStore, "set").and.callFake(() => Promise.resolve());
            
                        // act
                        await subject.createSignoutRequest({
                            state: "foo",
                        });
            
                        // assert
                        expect(setMock).toHaveBeenCalled();
                    });
            
                    it("should not generate state if no data", async () => {
                        // arrange
                        spyOn(subject.metadataService, "getEndSessionEndpoint").and.callFake(() => Promise.resolve("http://sts/signout"));
                        let setMock = spyOn(subject.settings.stateStore, "set").and.callFake(() => Promise.resolve());
            
                        // act
                        await subject.createSignoutRequest({});
            
                        // assert
                        expect(setMock).not.toHaveBeenCalled();
                    });
                });
            
                describe("readSignoutResponseState", () => {
                    it("should return a promise", async () => {
                        // act
                        let p = subject.readSignoutResponseState("http://app/cb?state=state");
            
                        // assert
                        expect(p).toBeInstanceOf(Promise);
                        // eslint-disable-next-line no-empty
                        try { await p; } catch {}
                    });
            
                    it("should return result if no state on response", async () => {
                        // act
                        let { response } = await subject.readSignoutResponseState("http://app/cb");
            
                        // assert
                        expect(response).toBeInstanceOf(Common.oidc.response.Signout);
                    });
            
                    it("should return error", async () => {
                        // act
                        try {
                            await subject.readSignoutResponseState("http://app/cb?error=foo");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toEqual("foo");
                        }
                    });
            
                    it("should fail if storage fails", async () => {
                        // arrange
                        spyOn(subject.settings.stateStore, "get").and.rejectWith(new Error("fail"));
            
                        // act
                        try {
                            await subject.readSignoutResponseState("http://app/cb?state=state");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toContain("fail");
                        }
                    });
            
                    it("should deserialize stored state and return state and response", async () => {
                        // arrange
                        let item = Ext.create('oidc.state.state', { id: "1", requestType: "type" }).toStorageString();
                        spyOn(subject.settings.stateStore, "get").and.callFake(() => Promise.resolve(item));
            
                        // act
                        let { state, response } = await subject.readSignoutResponseState("http://app/cb?state=1");
            
                        // assert
                        expect(state).toBeDefined();
                        expect(state?.id).toEqual("1");
                        expect(state?.requestType).toEqual("type");
                        expect(response.state).toEqual("1");
                    });
            
                    it("should call validator with state even if error in response", async () => {
                        // arrange
                        let item = Ext.create('oidc.state.state', {
                            id: "1",
                            data: "bar",
                            requestType: "type",
                        });
                        spyOn(subject.settings.stateStore, "remove").and.callFake(() => Promise.resolve(item.toStorageString()));
                        let validateSignoutResponse = spyOn(subject["validator"], "validateSignoutResponse").and.returnValue(null);
            
                        // act
                        let response = await subject.processSignoutResponse("http://app/cb?state=1&error=foo");
            
                        // assert
                        expect(validateSignoutResponse).toHaveBeenCalledWith(response, item);
                    });
                });
            
                describe("processSignoutResponse", () => {
                    it("should return a promise", async () => {
                        // act
                        let p = subject.processSignoutResponse("state=state");
            
                        // assert
                        expect(p).toBeInstanceOf(Promise);
                        // eslint-disable-next-line no-empty
                        try { await p; } catch {}
                    });
            
                    it("should return result if no state on response", async () => {
                        // act
                        let response = await subject.processSignoutResponse("http://app/cb");
            
                        // assert
                        expect(response).toBeInstanceOf(Common.oidc.response.Signout);
                    });
            
                    it("should return error", async () => {
                        // act
                        try {
                            await subject.processSignoutResponse("http://app/cb?error=foo");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toEqual("foo");
                        }
                    });
            
                    it("should fail if storage fails", async () => {
                        // arrange
                        spyOn(subject.settings.stateStore, "remove").and.rejectWith(new Error("fail"));
            
                        // act
                        try {
                            await subject.processSignoutResponse("http://app/cb?state=state");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toContain("fail");
                        }
                    });
            
                    it("should deserialize stored state and call validator", async () => {
                        // arrange
                        let item = Ext.create('oidc.state.state', {
                            id: "1",
                            requestType: "type",
                        });
                        spyOn(subject.settings.stateStore, "remove").and.callFake(async () => item.toStorageString());
                        let validateSignoutResponse = spyOn(subject["validator"], "validateSignoutResponse");
            
                        // act
                        let response = await subject.processSignoutResponse("http://app/cb?state=1");
            
                        // assert
                        expect(validateSignoutResponse).toHaveBeenCalledWith(response, item);
                    });
            
                    it("should call validator with state even if error in response", async () => {
                        // arrange
                        let item = Ext.create('oidc.state.state', {
                            id: "1",
                            data: "bar",
                            requestType: "type",
                        });
                        spyOn(subject.settings.stateStore, "remove").and.callFake(async () => item.toStorageString());
                        let validateSignoutResponse = spyOn(subject["validator"], "validateSignoutResponse");
            
                        // act
                        let response = await subject.processSignoutResponse("http://app/cb?state=1&error=foo");
            
                        // assert
                        expect(validateSignoutResponse).toHaveBeenCalledWith(response, item);
                    });
                });
            
                describe("clearStaleState", () => {
            
                    it("should call State.clearStaleState", async () => {
                        // arrange
                        let clearStaleState = spyOn(Common.oidc.state.State, "clearStaleState");
            
                        // act
                        await subject.clearStaleState();
            
                        // assert
                        expect(clearStaleState).toHaveBeenCalled();
                    });
                });
            
                describe("revokeToken", () => {
                    it("revokes a token type", async () => {
                        // arrange
                        let revokeSpy = spyOn(subject["tokenClient"], "revoke").and.resolveTo();
            
                        // act
                        await subject.revokeToken("token", "access_token");
            
                        // assert
                        expect(revokeSpy).toHaveBeenCalledWith({
                            token: "token",
                            tokenTypeHint: "access_token",
                        });
                    });
                });
            });
            
        }
    }

});
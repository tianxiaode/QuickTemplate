Ext.define('Test.spec.common.oidc.Client', {
    requires: [
        'Common.oidc.Client'
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
                            redirect_uri: "redirect",
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
            
                // describe("readSigninResponseState", () => {
            
                //     it("should fail if no state on response", async () => {
                //         // arrange
                //         spyOn(subject.settings.stateStore, "get").and.resolveTo("state");
            
                //         // act
                //         try {
                //             await subject.readSigninResponseState("http://app/cb");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err).message).toContain("state");
                //         }
                //     });
            
                //     it("should fail if storage fails", async () => {
                //         // arrange
                //         spyOn(subject.settings.stateStore, "get").and.rejectWith(new Error("fail"));
            
                //         // act
                //         try {
                //             await subject.readSigninResponseState("http://app/cb?state=state");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err).message).toContain("fail");
                //         }
                //     });
            
                //     it("should deserialize stored state and return state and response", async () => {
                //         // arrange
                //         let item = await Common.oidc.state.Signin.create({
                //             id: "1",
                //             authority: "authority",
                //             clientId: "client",
                //             redirectUri: "http://app/cb",
                //             scope: "scope",
                //             requestType: "type",
                //         });
                //         spyOn(subject.settings.stateStore, "get").and.resolveTo(item.toStorageString());
            
                //         // act
                //         let { state, response } = await subject.readSigninResponseState("http://app/cb?state=1");
            
                //         // assert
                //         expect(state.id).toEqual("1");
                //         expect(state.authority).toEqual("authority");
                //         expect(state.client_id).toEqual("client");
                //         expect(state.request_type).toEqual("type");
                //         expect(response.state).toEqual("1");
                //     });
                // });
            
                // describe("processSigninResponse", () => {
                //     it("should fail if no state on response", async () => {
                //         // arrange
                //         spyOn(subject.settings.stateStore, "get").and.resolveTo("state");
            
                //         // act
                //         try {
                //             await subject.processSigninResponse("http://app/cb");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err).message).toContain("state");
                //         }
                //     });
            
                //     it("should fail if storage fails", async () => {
                //         // arrange
                //         spyOn(subject.settings.stateStore, "remove").and.rejectWith(new Error("fail"));
            
                //         // act
                //         try {
                //             await subject.processSigninResponse("http://app/cb?state=state");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err).message).toContain("fail");
                //         }
                //     });
            
                //     it("should deserialize stored state and call validator", async () => {
                //         // arrange
                //         let item = await Common.oidc.state.Signin.create({
                //             id: "1",
                //             authority: "authority",
                //             clientId: "client",
                //             redirectUri: "http://app/cb",
                //             scope: "scope",
                //             requestType: "type",
                //         });
                //         spyOn(subject.settings.stateStore, "remove")
                //             .and.callFake(async () => item.toStorageString());
                //         let validateSigninResponseMock = spyOn(subject["validator"], "validateSigninResponse")
                //             .and.resolveTo();
            
                //         // act
                //         let response = await subject.processSigninResponse("http://app/cb?state=1");
            
                //         // assert
                //         expect(validateSigninResponseMock).toHaveBeenCalledWith(response, item);
                //     });
                // });
            
                // describe("processResourceOwnerPasswordCredentials", () => {
            
                //     it("should fail on wrong credentials", async () => {
                //         // arrange
                //         jest.spyOn(subject["_tokenClient"], "exchangeCredentials").mockRejectedValue(new Error("Wrong credentials"));
            
                //         // act
                //         await expect(subject.processResourceOwnerPasswordCredentials({ username: "u", password: "p", skipUserInfo: false }))
                //             // assert
                //             .rejects.toThrow(Error);
                //     });
            
                //     it("should fail on invalid response", async () => {
                //         // arrange
                //         jest.spyOn(subject["_tokenClient"], "exchangeCredentials").mockResolvedValue({});
                //         jest.spyOn(subject["_validator"], "validateCredentialsResponse").mockRejectedValue(new Error("Wrong response"));
            
                //         // act
                //         await expect(subject.processResourceOwnerPasswordCredentials({ username: "u", password: "p", skipUserInfo: false }))
                //             // assert
                //             .rejects.toThrow(Error);
                //     });
            
                //     it("should return response on success", async () => {
                //         // arrange
                //         jest.spyOn(subject["_tokenClient"], "exchangeCredentials").mockResolvedValue({
                //             access_token: "access_token",
                //             id_token: "id_token",
                //             scope: "openid profile email",
                //         });
                //         jest.spyOn(subject["_validator"], "validateCredentialsResponse").mockImplementation(
                //             async (response: SigninResponse): Promise<void> => {
                //                 Object.assign(response, { profile: { sub: "subsub" } });
                //             },
                //         );
            
                //         // act
                //         let signinResponse: SigninResponse = await subject.processResourceOwnerPasswordCredentials({ username: "u", password: "p", skipUserInfo: false });
            
                //         // assert
                //         expect(signinResponse).toHaveProperty("access_token", "access_token");
                //         expect(signinResponse).toHaveProperty("id_token", "id_token");
                //         expect(signinResponse).toHaveProperty("scope", "openid profile email");
                //         expect(signinResponse).toHaveProperty("profile", { sub: "subsub" });
                //     });
            
                // });
            
                // describe("useRefreshToken", () => {
                //     it("should return a SigninResponse", async () => {
                //         // arrange
                //         let tokenResponse = {
                //             access_token: "new_access_token",
                //             scope: "replacement scope",
                //         };
                //         jest.spyOn(subject["_tokenClient"], "exchangeRefreshToken").mockResolvedValue(tokenResponse);
                //         let state = new RefreshState({
                //             refresh_token: "refresh_token",
                //             id_token: "id_token",
                //             session_state: "session_state",
                //             scope: "openid",
                //             profile: {} as UserProfile,
                //         });
            
                //         // act
                //         let response = await subject.useRefreshToken({ state });
            
                //         // assert
                //         expect(response).toBeInstanceOf(SigninResponse);
                //         expect(response).toMatchObject(tokenResponse);
                //     });
            
                //     it("should preserve the session_state and scope", async () => {
                //         // arrange
                //         let tokenResponse = {
                //             access_token: "new_access_token",
                //         };
                //         let exchangeRefreshTokenMock =
                //             jest.spyOn(subject["_tokenClient"], "exchangeRefreshToken")
                //                 .mockResolvedValue(tokenResponse);
                //         jest.spyOn(JwtUtils, "decode").mockReturnValue({ sub: "sub" });
                //         let state = new RefreshState({
                //             refresh_token: "refresh_token",
                //             id_token: "id_token",
                //             session_state: "session_state",
                //             scope: "openid",
                //             profile: {} as UserProfile,
                //         }, "resource");
            
                //         // act
                //         let response = await subject.useRefreshToken({ state });
            
                //         // assert
                //         expect(exchangeRefreshTokenMock).toHaveBeenCalledWith( {
                //             refresh_token: "refresh_token",
                //             scope: "openid",
                //             timeoutInSeconds: undefined,
                //             resource: "resource",
                //         });
                //         expect(response).toBeInstanceOf(SigninResponse);
                //         expect(response).toMatchObject(tokenResponse);
                //         expect(response).toHaveProperty("session_state", state.session_state);
                //         expect(response).toHaveProperty("scope", state.scope);
                //     });
            
                //     it("should filter allowable scopes", async () => {
                //         // arrange
                //         let settings: OidcClientSettings = {
                //             authority: "authority",
                //             client_id: "client",
                //             redirect_uri: "redirect",
                //             post_logout_redirect_uri: "http://app",
                //             refreshTokenAllowedScope: "allowed_scope",
                //         };
                //         subject = new OidcClient(settings);
            
                //         let tokenResponse = {
                //             access_token: "new_access_token",
                //         };
                //         let exchangeRefreshTokenMock =
                //             jest.spyOn(subject["_tokenClient"], "exchangeRefreshToken")
                //                 .mockResolvedValue(tokenResponse);
                //         jest.spyOn(JwtUtils, "decode").mockReturnValue({ sub: "sub" });
                //         let state = new RefreshState({
                //             refresh_token: "refresh_token",
                //             id_token: "id_token",
                //             session_state: "session_state",
                //             scope: "unallowed_scope allowed_scope unallowed_scope_2",
                //             profile: {} as UserProfile,
                //         });
            
                //         // act
                //         let response = await subject.useRefreshToken({ state });
            
                //         // assert
                //         expect(exchangeRefreshTokenMock).toHaveBeenCalledWith( {
                //             refresh_token: "refresh_token",
                //             scope: "allowed_scope",
                //             timeoutInSeconds: undefined,
                //         });
                //         expect(response).toBeInstanceOf(SigninResponse);
                //         expect(response).toMatchObject(tokenResponse);
                //         expect(response).toHaveProperty("session_state", state.session_state);
                //         expect(response).toHaveProperty("scope", "allowed_scope");
                //     });
            
                //     it("should enforce a matching sub claim", async () => {
                //         // arrange
                //         let profiles: Record<string, JwtClaims> = {
                //             id_token: {
                //                 sub: "current_sub",
                //             },
                //             new_id_token: {
                //                 sub: "new_sub",
                //             },
                //         };
                //         let tokenResponse = {
                //             access_token: "new_access_token",
                //             id_token: "new_id_token",
                //         };
                //         jest.spyOn(subject["_tokenClient"], "exchangeRefreshToken").mockResolvedValue(tokenResponse);
                //         jest.spyOn(JwtUtils, "decode").mockImplementation((token) => profiles[token]);
                //         let state = new RefreshState({
                //             refresh_token: "refresh_token",
                //             id_token: "id_token",
                //             session_state: "session_state",
                //             scope: "openid",
                //             profile: {} as UserProfile,
                //         });
            
                //         // act
                //         await expect(subject.useRefreshToken({ state }))
                //             // assert
                //             .rejects.toThrow("sub in id_token does not match current sub");
                //     });
                // });
            
                // describe("createSignoutRequest", () => {
                //     it("should return SignoutRequest", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve("http://sts/signout"));
            
                //         // act
                //         let request = await subject.createSignoutRequest();
            
                //         // assert
                //         expect(request).toBeInstanceOf(SignoutRequest);
                //     });
            
                //     it("should pass state in place of data to SignoutRequest", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve("http://sts/signout"));
            
                //         // act
                //         let request = await subject.createSignoutRequest({
                //             state: "foo",
                //             post_logout_redirect_uri: "bar",
                //             id_token_hint: "baz",
                //         });
            
                //         // assert
                //         expect(request.state).toBeDefined();
                //         expect(request.state?.data).toEqual("foo");
                //         let url = request.url;
                //         expect(url).toContain("http://sts/signout");
                //         expect(url).toContain("post_logout_redirect_uri=bar");
                //         expect(url).toContain("id_token_hint=baz");
                //     });
            
                //     it("should pass params to SignoutRequest", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve("http://sts/signout"));
            
                //         // act
                //         let request = await subject.createSignoutRequest({
                //             state: "foo",
                //             post_logout_redirect_uri: "bar",
                //             id_token_hint: "baz",
                //         });
            
                //         // assert
                //         expect(request.state).toBeDefined();
                //         expect(request.state?.data).toEqual("foo");
                //         let url = request.url;
                //         expect(url).toContain("http://sts/signout");
                //         expect(url).toContain("post_logout_redirect_uri=bar");
                //         expect(url).toContain("id_token_hint=baz");
                //     });
            
                //     it("should pass params to SignoutRequest w/o id_token_hint and client_id", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve("http://sts/signout"));
            
                //         // act
                //         let request = await subject.createSignoutRequest({
                //             state: "foo",
                //             post_logout_redirect_uri: "bar",
                //         });
            
                //         // assert
                //         expect(request.state).toBeDefined();
                //         expect(request.state?.data).toEqual("foo");
                //         let url = request.url;
                //         expect(url).toContain("http://sts/signout");
                //         expect(url).toContain("post_logout_redirect_uri=bar");
                //         expect(url).toContain("client_id=client");
                //     });
            
                //     it("should pass params to SignoutRequest with client_id", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve("http://sts/signout"));
            
                //         // act
                //         let request = await subject.createSignoutRequest({
                //             state: "foo",
                //             post_logout_redirect_uri: "bar",
                //             client_id: "baz",
                //         });
            
                //         // assert
                //         expect(request.state).toBeDefined();
                //         expect(request.state?.data).toEqual("foo");
                //         let url = request.url;
                //         expect(url).toContain("http://sts/signout");
                //         expect(url).toContain("post_logout_redirect_uri=bar");
                //         expect(url).toContain("client_id=baz");
                //     });
            
                //     it("should fail if metadata fails", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockRejectedValue(new Error("test"));
            
                //         // act
                //         try {
                //             await subject.createSignoutRequest();
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err as Error).message).toContain("test");
                //         }
                //     });
            
                //     it("should fail if no signout endpoint on metadata", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve(undefined));
            
                //         // act
                //         try {
                //             await subject.createSignoutRequest();
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err as Error).message).toContain("No end session endpoint");
                //         }
                //     });
            
                //     it("should store state", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve("http://sts/signout"));
                //         let setMock = jest.spyOn(subject.settings.stateStore, "set").mockImplementation(() => Promise.resolve());
            
                //         // act
                //         await subject.createSignoutRequest({
                //             state: "foo",
                //         });
            
                //         // assert
                //         expect(setMock).toBeCalled();
                //     });
            
                //     it("should not generate state if no data", async () => {
                //         // arrange
                //         jest.spyOn(subject.metadataService, "getEndSessionEndpoint").mockImplementation(() => Promise.resolve("http://sts/signout"));
                //         let setMock = jest.spyOn(subject.settings.stateStore, "set").mockImplementation(() => Promise.resolve());
            
                //         // act
                //         await subject.createSignoutRequest();
            
                //         // assert
                //         expect(setMock).not.toBeCalled();
                //     });
                // });
            
                // describe("readSignoutResponseState", () => {
                //     it("should return a promise", async () => {
                //         // act
                //         let p = subject.readSignoutResponseState("http://app/cb?state=state");
            
                //         // assert
                //         expect(p).toBeInstanceOf(Promise);
                //         // eslint-disable-next-line no-empty
                //         try { await p; } catch {}
                //     });
            
                //     it("should return result if no state on response", async () => {
                //         // act
                //         let { response } = await subject.readSignoutResponseState("http://app/cb");
            
                //         // assert
                //         expect(response).toBeInstanceOf(SignoutResponse);
                //     });
            
                //     it("should return error", async () => {
                //         // act
                //         try {
                //             await subject.readSignoutResponseState("http://app/cb?error=foo");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err as ErrorResponse).error).toEqual("foo");
                //         }
                //     });
            
                //     it("should fail if storage fails", async () => {
                //         // arrange
                //         jest.spyOn(subject.settings.stateStore, "get").mockRejectedValue(new Error("fail"));
            
                //         // act
                //         try {
                //             await subject.readSignoutResponseState("http://app/cb?state=state");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err as Error).message).toContain("fail");
                //         }
                //     });
            
                //     it("should deserialize stored state and return state and response", async () => {
                //         // arrange
                //         let item = new State({ id: "1", request_type: "type" }).toStorageString();
                //         jest.spyOn(subject.settings.stateStore, "get").mockImplementation(() => Promise.resolve(item));
            
                //         // act
                //         let { state, response } = await subject.readSignoutResponseState("http://app/cb?state=1");
            
                //         // assert
                //         expect(state).toBeDefined();
                //         expect(state?.id).toEqual("1");
                //         expect(state?.request_type).toEqual("type");
                //         expect(response.state).toEqual("1");
                //     });
            
                //     it("should call validator with state even if error in response", async () => {
                //         // arrange
                //         let item = new State({
                //             id: "1",
                //             data: "bar",
                //             request_type: "type",
                //         });
                //         jest.spyOn(subject.settings.stateStore, "remove")
                //             .mockImplementation(() => Promise.resolve(item.toStorageString()));
                //         let validateSignoutResponse = jest.spyOn(subject["_validator"], "validateSignoutResponse")
                //             .mockReturnValue();
            
                //         // act
                //         let response = await subject.processSignoutResponse("http://app/cb?state=1&error=foo");
            
                //         // assert
                //         expect(validateSignoutResponse).toBeCalledWith(response, item);
                //     });
                // });
            
                // describe("processSignoutResponse", () => {
                //     it("should return a promise", async () => {
                //         // act
                //         let p = subject.processSignoutResponse("state=state");
            
                //         // assert
                //         expect(p).toBeInstanceOf(Promise);
                //         // eslint-disable-next-line no-empty
                //         try { await p; } catch {}
                //     });
            
                //     it("should return result if no state on response", async () => {
                //         // act
                //         let response = await subject.processSignoutResponse("http://app/cb");
            
                //         // assert
                //         expect(response).toBeInstanceOf(SignoutResponse);
                //     });
            
                //     it("should return error", async () => {
                //         // act
                //         try {
                //             await subject.processSignoutResponse("http://app/cb?error=foo");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err as ErrorResponse).error).toEqual("foo");
                //         }
                //     });
            
                //     it("should fail if storage fails", async () => {
                //         // arrange
                //         jest.spyOn(subject.settings.stateStore, "remove").mockRejectedValue(new Error("fail"));
            
                //         // act
                //         try {
                //             await subject.processSignoutResponse("http://app/cb?state=state");
                //             fail("should not come here");
                //         }
                //         catch (err) {
                //             expect(err).toBeInstanceOf(Error);
                //             expect((err as Error).message).toContain("fail");
                //         }
                //     });
            
                //     it("should deserialize stored state and call validator", async () => {
                //         // arrange
                //         let item = new State({
                //             id: "1",
                //             request_type: "type",
                //         });
                //         jest.spyOn(subject.settings.stateStore, "remove")
                //             .mockImplementation(async () => item.toStorageString());
                //         let validateSignoutResponse = jest.spyOn(subject["_validator"], "validateSignoutResponse")
                //             .mockReturnValue();
            
                //         // act
                //         let response = await subject.processSignoutResponse("http://app/cb?state=1");
            
                //         // assert
                //         expect(validateSignoutResponse).toBeCalledWith(response, item);
                //     });
            
                //     it("should call validator with state even if error in response", async () => {
                //         // arrange
                //         let item = new State({
                //             id: "1",
                //             data: "bar",
                //             request_type: "type",
                //         });
                //         jest.spyOn(subject.settings.stateStore, "remove")
                //             .mockImplementation(async () => item.toStorageString());
                //         let validateSignoutResponse = jest.spyOn(subject["_validator"], "validateSignoutResponse")
                //             .mockReturnValue();
            
                //         // act
                //         let response = await subject.processSignoutResponse("http://app/cb?state=1&error=foo");
            
                //         // assert
                //         expect(validateSignoutResponse).toBeCalledWith(response, item);
                //     });
                // });
            
                // describe("clearStaleState", () => {
            
                //     it("should call State.clearStaleState", async () => {
                //         // arrange
                //         let clearStaleState = jest.spyOn(State, "clearStaleState");
            
                //         // act
                //         await subject.clearStaleState();
            
                //         // assert
                //         expect(clearStaleState).toBeCalled();
                //     });
                // });
            
                // describe("revokeToken", () => {
                //     it("revokes a token type", async () => {
                //         // arrange
                //         let revokeSpy = jest.spyOn(subject["_tokenClient"], "revoke").mockResolvedValue();
            
                //         // act
                //         await subject.revokeToken("token", "access_token");
            
                //         // assert
                //         expect(revokeSpy).toHaveBeenCalledWith({
                //             token: "token",
                //             token_type_hint: "access_token",
                //         });
                //     });
                // });
            });
            
        }
    }

});
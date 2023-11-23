    Ext.define('Test.spec.common.oidc.response.Validator', {
    requires: [
        'Common.oidc.response.Validator'
    ],

    statics: {
        run() {
            describe("Common.oidc.response.Validator", () => {
                let stubState;
                let stubResponse;
                let settings;
                let metadataService;
                let claimsService;
                let subject;
                let exchangeCodeSpy;
                let getClaimsSpy;
                let jwtDecodeSpy;
            
                beforeEach(() => {
                    stubState = {
                        id: "the_id",
                        data: { some: "data" },
                        clientId: "client",
                        authority: "op",
                        scope: "openid",
                    };
                    stubResponse = {
                        state: "the_id",
                        isOpenId: false,
                    };
                    settings = Ext.create('oidc.setting.client', {
                        authority: "op",
                        clientId: "client",
                        loadUserInfo: true
                    });
                    metadataService = Ext.create('oidc.service.metadata', settings);
            
                    claimsService = Ext.create('oidc.service.claims', settings);
                    subject = Ext.create('oidc.response.validator', settings, metadataService, claimsService);
                    exchangeCodeSpy = spyOn(subject["tokenClient"], "exchangeCode").and.resolveTo({});
                    getClaimsSpy = spyOn(subject["userInfoService"], "getClaims").and.resolveTo({nickname: "Nick"});
                    jwtDecodeSpy = spyOn(Oidc.Jwt, 'decode');
                });

                afterEach(()=>{
                    getClaimsSpy.calls.reset();
                    exchangeCodeSpy.calls.reset();
                    jwtDecodeSpy.calls.reset();
                })
            
                describe("validateSignoutResponse", () => {
                    it("should validate that the client state matches response state", () => {
                        // arrange
                        Object.assign(stubResponse, { state: "not_the_id" });

                        // act
                        expect(()=>subject.validateSignoutResponse(stubResponse, stubState))
                            // assert
                            .toThrowError("State does not match");
                    });
            
                    it("should fail on error response", () => {
                        // arrange
                        Object.assign(stubResponse, { error: "some_error" });
            
                        // act
                        expect(() =>
                            subject.validateSignoutResponse(stubResponse, stubState),
                        )
                            // assert
                            .toThrowError(Error);
                    });
            
                    it("should return data for successful responses", () => {
                        // act
                        subject.validateSignoutResponse(stubResponse, stubState);
            
                        // assert
                        expect(stubResponse.userState).toEqual({ some: "data" });
                    });
                });
            
                describe("validateSigninResponse", () => {
                    it("should process a valid signin response", async () => {
                        // arrange
                        Object.assign(stubResponse, { code: "foo" });
                        Object.assign(stubState, { codeVerifier: "secret" });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(subject["tokenClient"].exchangeCode).toHaveBeenCalled();
                        expect(stubResponse.userState).toEqual(stubState.data);
                        expect(stubResponse.scope).toEqual(stubState.scope);
                    });

            
                    it("should not process code if state fails", async () => {
                        // arrange
                        Object.assign(stubResponse, { code: "code", state: "not_the_id" });
                        exchangeCodeSpy.and.rejectWith(new Error("should not come here"));
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError("State does not match");
                        expect(exchangeCodeSpy).not.toHaveBeenCalled();
                    });
            
                    it("should process valid claims", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            isOpenId: true,
                            accessToken: "access_token",
                            idToken: "id_token",
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "sub" });
                        getClaimsSpy.and.resolveTo({
                            sub: "sub",
                        });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(getClaimsSpy).toHaveBeenCalledWith(
                            "access_token",
                        );
                    });
            
                    it("should not process claims if state fails", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            state: "not_the_id",
                            accessToken: "access_token",
                            isOpenId: true,
                        });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError("State does not match");
                        expect(getClaimsSpy).not.toHaveBeenCalled();
                    });
            
                    it("should validate that the client state matches response state", async () => {
                        // arrange
                        Object.assign(stubResponse, { state: "not_the_id" });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError("State does not match");
                    });
            
                    it("should fail if no client_id on state", async () => {
                        // arrange
                        Object.assign(stubState, { clientId: undefined });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError("No client_id on state");
                    });
            
                    it("should fail if no authority on state", async () => {
                        // arrange
                        Object.assign(stubState, { authority: undefined });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError("No authority on state");
                    });
            
                    it("should fail if the authority on the state is not the same as the settings", async () => {
                        // arrange
                        Object.assign(stubState, { authority: "something different" });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError(/authority mismatch/);
                    });
            
                    it("should fail if the client_id on the state is not the same as the settings", async () => {
                        // arrange
                        Object.assign(stubState, { clientId: "something different" });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError(/client_id mismatch/);
                    });
            
                    it("should return data for error responses", async () => {
                        // arrange
                        Object.assign(stubResponse, { error: "some_error" });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError('some_error');
                    });
            
                    it("should fail if request was code flow but no code in response", async () => {
                        // arrange
                        Object.assign(stubState, { codeVerifier: "secret" });
                        Object.assign(stubResponse, { code: undefined });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError("Expected code in response");
                    });
            
                    it("should return data for successful responses", async () => {
                        // arrange
                        Object.assign(stubState, { codeVerifier: "secret" });
                        Object.assign(stubResponse, { code: "code" });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(stubResponse.userState).toEqual(stubState.data);
                    });
            
                    it("should filter protocol claims if OIDC", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            isOpenId: true,
                            id_token: "id_token",
                        });
                        jwtDecodeSpy.and.returnValue({
                            sub: "sub",
                            iss: "iss",
                            acr: "acr",
                            a: "apple",
                            b: "banana",
                        });
                        Object.assign(settings, { filterProtocolClaims: true });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(stubResponse.profile).not.toEqual("acr");
                    });
            
                    it("should not filter protocol claims if not OIDC", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            isOpenId: false,
                            profile: { a: "apple", b: "banana", iss: "foo" },
                        });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(stubResponse.profile?.iss).toEqual("foo");
                    });
            
                    it("should fail if sub from user info endpoint does not match sub in id_token", async () => {
                        // arrange
                        Object.assign(settings, { loadUserInfo: true });
                        Object.assign(stubResponse, {
                            isOpenId: true,
                            accessToken: "access_token",
                            idToken: "id_token",
                        });
                        jwtDecodeSpy.and.returnValue({
                            sub: "sub",
                            a: "apple",
                            b: "banana",
                        });
                        getClaimsSpy.and.resolveTo({
                            sub: "sub different",
                        });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState),
                        )
                            // assert
                            .toBeRejectedWithError(
                                "subject from UserInfo response does not match subject in ID Token",
                            );
                    });
            
                    it("should load and merge user info claims when loadUserInfo configured", async () => {
                        // arrange
                        Object.assign(settings, { loadUserInfo: true });
                        Object.assign(stubResponse, {
                            isOpenId: true,
                            accessToken: "access_token",
                            idToken: "id_token",
                        });
                        jwtDecodeSpy.and.returnValue({
                            sub: "sub",
                            a: "apple",
                            b: "banana",
                        });
                        getClaimsSpy.and.resolveTo({
                            sub: "sub",
                            c: "carrot",
                        });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(getClaimsSpy).toHaveBeenCalledWith(
                            "access_token",
                        );
                        expect(stubResponse.profile).toEqual({
                            sub: "sub",
                            a: "apple",
                            b: "banana",
                            c: "carrot",
                        });
                    });

                    it("should run if request was not openid", async () => {
                        // arrange
                        Object.assign(settings, { loadUserInfo: true });
                        Object.assign(stubResponse, {
                            isOpenId: false,
                            accessToken: "access_token",
                        });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(getClaimsSpy).toHaveBeenCalled();
                    });
            
                    it("should not load and merge user info claims when loadUserInfo not configured", async () => {
                        // arrange
                        Object.assign(settings, { loadUserInfo: false });
                        Object.assign(stubResponse, {
                            isOpenId: true,
                            accessToken: "access_token",
                            idToken: "id_token",
                        });
                        jwtDecodeSpy.and.returnValue({
                            sub: "sub",
                            a: "apple",
                            b: "banana",
                        });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(getClaimsSpy).not.toHaveBeenCalled();
                    });
            
                    it("should not load user info claims if no access token", async () => {
                        // arrange
                        Object.assign(settings, { loadUserInfo: true });
                        Object.assign(stubResponse, {
                            isOpenId: true,
                            idToken: "id_token",
                        });
                        jwtDecodeSpy.and.returnValue({
                            sub: "sub",
                            a: "apple",
                            b: "banana",
                        });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(getClaimsSpy).not.toHaveBeenCalled();
                    });
            
                    it("should not process code if response has no code", async () => {
                        // arrange
                        Object.assign(stubResponse, { code: undefined });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(exchangeCodeSpy).not.toHaveBeenCalled();
                    });
            
                    it("should include the code in the token request", async () => {
                        // arrange
                        Object.assign(stubResponse, { code: "code" });
                        Object.assign(stubState, { codeVerifier: "codeVerifier" });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        expect(exchangeCodeSpy).toHaveBeenCalledWith(jasmine.objectContaining({ code: stubResponse.code }));
                    });
            
                    it("should include data from state in the token request", async () => {
                        // arrange
                        Object.assign(stubResponse, { code: "code" });
                        Object.assign(stubState, {
                            clientSecret: "client_secret",
                            redirectUri: "redirect_uri",
                            codeVerifier: "codeVerifier",
                            extraTokenParams: { a: "a" },
                        });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(exchangeCodeSpy).toHaveBeenCalledWith({
                            code: stubResponse.code,
                            clientId: stubState.clientId,
                            clientSecret: stubState.clientSecret,
                            redirectUri: stubState.redirectUri,
                            codeVerifier: stubState.codeVerifier,
                            ...stubState.extraTokenParams,
                        });
                    });

                    it("should map token response data to response", async () => {
                        // arrange
                        Object.assign(stubResponse, { code: "code" });
                        Object.assign(stubState, { codeVerifier: "codeVerifier" });
                        const tokenResponse = {
                            error: "error",
                            errorDescription: "error_description",
                            errorUri: "error_uri",
                            idToken: "id_token",
                            sessionState: "session_state",
                            accessToken: "access_token",
                            refreshToken: "refresh_token",
                            tokenType: "token_type",
                            scope: "scope",
                            expiresAt: "expires_at",
                        };
                        exchangeCodeSpy.and.resolveTo(
                            tokenResponse,
                        );
                        jwtDecodeSpy.and.returnValue({ sub: "sub" });
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(stubResponse).toEqual(jasmine.objectContaining(tokenResponse));
                    });
            
                    it("should map token response expires_in to response", async () => {
                        // arrange
                        Object.assign(stubResponse, { code: "code" });
                        Object.assign(stubState, { codeVerifier: "code_verifier" });
                        let tokenResponse = { expiresIn: 42 };
                        exchangeCodeSpy.and.resolveTo(tokenResponse);
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(stubResponse).toEqual(jasmine.objectContaining({ expiresIn: 42 }));
                    });
            
                    it("should validate and decode id_token if response has id_token", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: true,
                        });
                        let profile = { sub: "sub" };
                        jwtDecodeSpy.and.returnValue(profile);
            
                        // act
                        await subject.validateSigninResponse(stubResponse, stubState);
            
                        // assert
                        expect(Oidc.Jwt.decode).toHaveBeenCalledWith("id_token");
                        expect(stubResponse.profile).toEqual(profile);
                    });
            
                    it("should fail if id_token does not contain sub", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: true,
                        });
                        jwtDecodeSpy.and.returnValue({ a: "a" });
            
                        // act
                        await expectAsync(
                            subject.validateSigninResponse(stubResponse, stubState)
                        )
                            // assert
                            .toBeRejectedWithError("ID Token is missing a subject claim");
                        expect(Oidc.Jwt.decode).toHaveBeenCalledWith("id_token");
                        expect(stubResponse.profile).toBeUndefined();
                    });
                });
            
                describe("validateCredentialsResponse", () => {
                    it("should process a valid openid signin response (skipping userInfo)", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: true,
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "subsub" });
            
                        // act
                        await subject.validateCredentialsResponse(stubResponse, true);
            
                        // assert
                        expect(Oidc.Jwt.decode).toHaveBeenCalledWith("id_token");
                        expect(getClaimsSpy).not.toHaveBeenCalledWith();
                        expect(stubResponse.profile).toEqual({ sub: "subsub" });
                    });
                    it("should not process an invalid openid signin response", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: true,
                        });
                        jwtDecodeSpy.and.returnValue({ sub: undefined });
            
                        // act
                        await expectAsync(
                            subject.validateCredentialsResponse(stubResponse, true),
                        )
                            // assert
                            .toBeRejectedWithError(Error);
                        expect(Oidc.Jwt.decode).toHaveBeenCalledWith("id_token");
                        expect(stubResponse.profile).toBeUndefined();
                    });
            
                    it("should process a valid non-openid signin response skipping userInfo", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: false,
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "subsub" });
            
                        // act
                        await subject.validateCredentialsResponse(stubResponse, true);
            
                        // assert
                        expect(Oidc.Jwt.decode).not.toHaveBeenCalledWith("id_token");
                        expect(getClaimsSpy).not.toHaveBeenCalledWith();
                        expect(stubResponse.profile).toEqual({});
                    });
            
                    it("should process a valid non-openid signin response (not loading userInfo)", async () => {
                        // arrange
                        Object.assign(settings, { loadUserInfo: false });
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: false,
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "subsub" });
            
                        // act
                        await subject.validateCredentialsResponse(stubResponse, false);
            
                        // assert
                        expect(Oidc.Jwt.decode).not.toHaveBeenCalledWith("id_token");
                        expect(getClaimsSpy).not.toHaveBeenCalledWith();
                        expect(stubResponse.profile).toEqual({});
                    });
            
                    it("should process a valid non-openid signin response without access_token", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: false,
                            accessToken: "",
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "subsub" });
            
                        // act
                        await subject.validateCredentialsResponse(stubResponse, false);
            
                        // assert
                        expect(Oidc.Jwt.decode).not.toHaveBeenCalledWith("id_token");
                        expect(getClaimsSpy).not.toHaveBeenCalledWith();
                        expect(stubResponse.profile).toEqual({});
                    });
            
                    it("should process a valid non-openid signin response with userInfo", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: false,
                            accessToken: "access_token",
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "subsub" });
            
                        // act
                        await subject.validateCredentialsResponse(stubResponse, false);
            
                        // assert
                        expect(Oidc.Jwt.decode).not.toHaveBeenCalledWith("id_token");
                        expect(getClaimsSpy).toHaveBeenCalledWith(
                            "access_token",
                        );
                        expect(stubResponse.profile).toEqual({
                            nickname: "Nick",
                        });
                    });
            
                    it("should not process a valid openid signin response with wrong userInfo", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: true,
                            accessToken: "access_token",
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "subsub" });
                        getClaimsSpy.and.resolveTo({ sub: "anotherSub", nickname: "Nick" });
            
                        // act
                        await expectAsync(
                            subject.validateCredentialsResponse(stubResponse, false),
                        )
                            // assert
                            .toBeRejectedWithError(Error);
                        expect(Oidc.Jwt.decode).toHaveBeenCalledWith("id_token");
                        expect(getClaimsSpy).toHaveBeenCalledWith(
                            "access_token",
                        );
                        expect(stubResponse.profile).toEqual({ sub: "subsub" });
                    });
            
                    it("should process a valid openid signin response with correct userInfo", async () => {
                        // arrange
                        Object.assign(stubResponse, {
                            idToken: "id_token",
                            isOpenId: true,
                            accessToken: "access_token",
                        });
                        jwtDecodeSpy.and.returnValue({ sub: "subsub" });
                        getClaimsSpy.and.resolveTo({ sub: "subsub", nickname: "Nick" });
            
                        // act
                        await subject.validateCredentialsResponse(stubResponse, false);
            
                        // assert
                        expect(Oidc.Jwt.decode).toHaveBeenCalledWith("id_token");
                        expect(getClaimsSpy).toHaveBeenCalledWith(
                            "access_token",
                        );
                        expect(stubResponse.profile).toEqual({
                            sub: "subsub",
                            nickname: "Nick"
                        });
                    });
                });
            });
            
        }
    }
});
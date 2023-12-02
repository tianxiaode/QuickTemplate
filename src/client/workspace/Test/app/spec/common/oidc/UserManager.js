Ext.define('Test.spec.common.oidc.UserManager', {
    requires: [
        'Common.oidc.UserManager'
    ],
    statics: {
        run() {
            describe("Common.oidc.UserManager", () => {
                let targetWindow = {
                    location: {
                        redirect: jasmine.createSpy(),
                        assign: jasmine.createSpy(),
                        replace: jasmine.createSpy()
                    },
                    parent: {
                        location: {
                            redirect: jasmine.createSpy(),
                            assign: jasmine.createSpy(),
                            replace: jasmine.createSpy()
                        }
                    },
                    top: {
                        location: {
                            redirect: jasmine.createSpy(),
                            assign: jasmine.createSpy(),
                            replace: jasmine.createSpy()
                        }
                    },
                    stop: jasmine.createSpy(),
                };
                let userStoreMock;            
                let subject;
                let redirectNavigatorSpy;
            
                beforeEach(() => {
                    localStorage.clear();
            
                    userStoreMock = Ext.create('oidc.state.store');
            
                    subject = Ext.create('oidc.usermanager', {
                        authority: "http://sts/oidc",
                        clientId: "client",
                        redirectUri: "http://app/cb",
                        monitorSession : false,
                        userStore: userStoreMock,
                        metadata: {
                            authorizationEndpoint: "http://sts/oidc/authorize",
                            tokenEndpoint: "http://sts/oidc/token",
                            revocationEndpoint: "http://sts/oidc/revoke",
                        }
                    });

                    redirectNavigatorSpy = spyOn(subject.getRedirectNavigator(), 'getTargetWindow');
                    redirectNavigatorSpy.and.callFake((redirectTarget) => {
                        return redirectTarget === 'top' ? targetWindow.top || targetWindow : targetWindow;
                    });    

                });

                describe("constructor", () => {
                    it("should accept settings", () => {
                        // act
                        expect(subject.settings.clientId).toEqual("client");
                    });
            
                    [
                        { monitorSession: true, message: "should" },
                        { monitorSession: false, message: "should not" },
                    ].forEach((args)=>{
                        it("when monitorSession is $monitorSession $message init sessionMonitor", () =>{
                            let settings = { ...subject.settings, monitorSession: args.monitorSession };
                            let userManager = Ext.create('oidc.usermanager', settings);
                            let sessionMonitor = userManager["sessionMonitor"];
                            if (args.monitorSession) {
                                expect(sessionMonitor).toBeDefined();
                            } else {
                                expect(sessionMonitor).toBeNull();
                            }    
                        })
                    });
            
                    it("should accept redirectNavigator", () => {
                        let customRedirectNavigator = Ext.create('oidc.navigator.redirect', subject.settings);
            
                        let userManager = Ext.create('oidc.usermanager', subject.settings, customRedirectNavigator);
            
                        expect(userManager["redirectNavigator"]).toEqual(customRedirectNavigator);
                    });
            
                    it("should accept popupNavigator", () => {
                        let customPopupNavigator = Ext.create('oidc.navigator.popup', subject.settings);
            
                        let userManager = Ext.create('oidc.usermanager', subject.settings, undefined, customPopupNavigator);
            
                        expect(userManager["popupNavigator"]).toEqual(customPopupNavigator);
                    });
            
                    it("should accept iframeNavigator", () => {
                        let customiframeNavigator = Ext.create('oidc.navigator.iframe', subject.settings);
            
                        let userManager = Ext.create('oidc.usermanager', subject.settings, undefined, undefined, customiframeNavigator);
            
                        expect(userManager["iframeNavigator"]).toEqual(customiframeNavigator);
                    });
                });

                describe("settings", () => {
                    it("should be UserManagerSettings", () => {
                        // act
                        expect(subject.settings).toBeInstanceOf(Common.oidc.setting.UserManager);
                    });
                });
                            
                describe("getUser", () => {
                    it("should be able to call getUser without recursion", () => {
                        // arrange
                        subject.events.addUserLoaded(async () => {
                            await subject.getUser();
                        });
            
                        // act
                        subject.events.load({});
                    });
            
                    it("should return user if there is a user stored", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {},
                        });
                        subject["loadUser"] = jasmine.createSpy().and.returnValue(user);
                        let loadMock = spyOn(subject["events"], "load");
            
                        // act
                        let result = await subject.getUser();
            
                        // assert
                        expect(result).toEqual(user);
                        expect(loadMock).toHaveBeenCalledWith(user, false);
                    });
            
                    it("should return null if there is no user stored", async () => {
                        // arrange
                        subject["loadUser"] = jasmine.createSpy().and.returnValue(null);
                        let loadMock = spyOn(subject["events"], "load");
            
                        // act
                        let result = await subject.getUser();
            
                        // assert
                        expect(result).toBeNull();
                        expect(loadMock).not.toHaveBeenCalled();
                    });
                });
            
                describe("removeUser", () => {
                    it("should remove user from store and event unload", async () => {
                        // arrange
                        let storeUserMock = spyOn(subject, "storeUser");
                        let unloadMock = spyOn(subject["events"], "unload");
            
                        // act
                        await subject.removeUser();
            
                        // assert
                        expect(storeUserMock).toHaveBeenCalledWith(null);
                        expect(unloadMock).toHaveBeenCalled();
                    });
                });
            
                describe("revokeTokens", () => {
                    it("should revoke the token types specified", async () => {
                        // arrange
                        let user = {
                            accessToken: "foo",
                            refreshToken: "bar",
                        };
                        subject["loadUser"] = jasmine.createSpy().and.returnValue(user);
                        let revokeSpy = spyOn(subject.getClient(), "revokeToken").and.resolveTo(undefined);
                        let storeUserSpy = spyOn(subject, "storeUser").and.resolveTo(undefined);
            
                        // act
                        await subject.revokeTokens(["accessToken", "refreshToken"]);
            
                        // assert
                        
                        expect(revokeSpy).toHaveBeenCalledWith("foo", "accessToken");
                        expect(revokeSpy).toHaveBeenCalledWith("bar", "refreshToken");
                        expect(user).toEqual({
                            accessToken: "foo",
                            refreshToken: null,
                        });
                        expect(storeUserSpy).toHaveBeenCalled();
                    });
            
                    it("should skip revoking absent token types", async () => {
                        // arrange
                        subject["loadUser"] = jasmine.createSpy().and.returnValue({
                            accessToken: "foo",
                        });
                        let revokeSpy = spyOn(subject.getClient(), "revokeToken").and.resolveTo(undefined);
                        spyOn(subject, "storeUser").and.resolveTo(undefined);
            
                        // act
                        await subject.revokeTokens(["accessToken", "refreshToken"]);
            
                        // assert
                        expect(revokeSpy).toHaveBeenCalledTimes(1);
                        expect(revokeSpy).not.toHaveBeenCalledWith(jasmine.anything(), "refreshToken");
                    });
            
                    it("should succeed with no user session", async () => {
                        // act
                        await expectAsync(subject.revokeTokens())
                            // assert
                            .toBeResolved(undefined);
                    });
                });

                describe("signinRedirect", () => {


                    it("should redirect the browser to the authorize url", async () => {
                        // act
                        let spy = jasmine.createSpy();
                        targetWindow.location.assign.and.callFake(async (url)=>{ 
                            let state = new URL(url).searchParams.get("state");
                            let item = await userStoreMock.get(state);

                            expect(url).toContain(subject.settings.metadata.authorizationEndpoint);
                            expect(JSON.parse(item).requestType).toEqual("si:r");

                        });
                        subject.signinRedirect().finally(spy);

                        expect(spy).not.toHaveBeenCalled();
                    });
            
                    it("should pass navigator params to navigator", async () => {
                        // arrange
                        let prepareMock = spyOn(subject.getRedirectNavigator(), "prepare");
                        subject["signinStart"] = jasmine.createSpy();
                        let navParams = {
                            redirectMethod: "assign",
                        };
            
                        // act
                        await subject.signinRedirect(navParams);
            
                        // assert
                        expect(prepareMock).toHaveBeenCalledWith(navParams);
                    });
            
                    it("should pass extra args to _signinStart", async () => {
                        // arrange
                        spyOn(subject.getRedirectNavigator(), "prepare").and.callThrough();
                        subject["signinStart"] = jasmine.createSpy();
                        let extraArgs = {
                            extraQueryParams: { q : "q" },
                            extraTokenParams: { t: "t" },
                            state: "state",
                            nonce: "random_nonce",
                            redirectUri: "http://app/extra_callback",
                            prompt: "login",
                            urlState: "url_state",
                        };
            
                        // act
                        await subject.signinRedirect(extraArgs);
            
                        // assert
                        expect(subject["signinStart"]).toHaveBeenCalledWith(
                            {
                                requestType: "si:r",
                                ...extraArgs,
                            },
                            jasmine.objectContaining({
                                close: jasmine.any(Function),
                                navigate: jasmine.any(Function),
                            }),
                        );
                    });
                });
            
                describe("signinRedirectCallback", () => {
                    it("should return a user", async () => {
                        // arrange
                        let spy = spyOn(subject.getClient(), "processSigninResponse").and.resolveTo({});
            
                        // act
                        let user = await subject.signinRedirectCallback("http://app/cb?state=test&code=code");
            
                        // assert
                        expect(user).toBeInstanceOf(Common.oidc.User);
                    });
                });
            
                describe("signinResourceOwnerCredentials", () => {
                    it("should fail on wrong credentials", async () => {
                        // arrange
                        spyOn(subject.getClient(), "processResourceOwnerPasswordCredentials").and.rejectWith(new Error("Wrong credentials"));
            
                        // act
                        await expectAsync(subject.signinResourceOwnerCredentials({ username: "u", password: "p" }))
                            // assert
                            .toBeRejectedWithError('Wrong credentials');
                    });
            
                    it("should convert and store received response", async () => {
                        // arrange
                        let mockUser = {
                            accessToken: "access_token",
                            tokenType: "Bearer",
                            profile: {
                                sub: "subsub",
                                iss: "ississ",
                                aud: "aud",
                                exp: 0,
                                iat: 0,
                                nickname: "Nick",
                            },
                            sessionState: "ssss",
                            expiresAt: 0,
                            refreshToken: "refresh_token",
                            idToken: "id_token",
                            scope: "openid profile email",
                        };
                        spyOn(subject.getClient(), "processResourceOwnerPasswordCredentials").and.resolveTo(mockUser);
                        spyOn(subject["events"], "load").and.returnValue({});
            
                        // act
                        let user = await subject.signinResourceOwnerCredentials({ username: "u", password: "p" });
            
                        // assert
                        await expectAsync(subject.getUser()).toBeResolved(mockUser);
                        expect(subject["events"].load).toHaveBeenCalledWith(user);
                        expect(user.accessToken).toEqual(mockUser.accessToken);
                        expect(user.tokenType).toEqual(mockUser.tokenType);
                        expect(user.profile).toEqual(mockUser.profile);
                        expect(user.sessionState).toEqual(mockUser.sessionState);
                        expect(user.refreshToken).toEqual(mockUser.refreshToken);
                        expect(user.idToken).toEqual(mockUser.idToken);
                        expect(user.scope).toEqual(mockUser.scope);
                    });
                });
            
                describe("signinPopup", () => {
                    it("should pass navigator params to navigator", async () => {
                        // arrange
                        let handle = { } ;
                        let prepareMock = spyOn(subject.getPopupNavigator(), "prepare").and.callFake(() => Promise.resolve(handle));
                        subject["signin"] = jasmine.createSpy();
                        let navParams = {
                            popupWindowFeatures: {
                                location: false,
                                toolbar: false,
                                height: 100,
                            },
                            popupWindowTarget: "popupWindowTarget",
                        };
            
                        // act
                        await subject.signinPopup(navParams);
            
                        // assert
                        expect(prepareMock).toHaveBeenCalledWith(navParams);
                    });
            
                    it("should pass extra args to _signinStart", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {},
                        });
                        let handle = { };
                        spyOn(subject.getPopupNavigator(), "prepare")
                            .and.callFake(() => Promise.resolve(handle));
                        subject["signin"] = jasmine.createSpy().and.resolveTo(user);
                        let extraArgs = {
                            extraQueryParams: { q : "q" },
                            extraTokenParams: { t: "t" },
                            state: "state",
                            nonce: "random_nonce",
                            redirectUri: "http://app/extra_callback",
                            prompt: "login",
                        };
            
                        // act
                        await subject.signinPopup(extraArgs);
            
                        // assert
                        expect(subject["signin"]).toHaveBeenCalledWith(
                            {
                                requestType: "si:p",
                                display: "popup",
                                ...extraArgs,
                            },
                            handle,
                        );
                    });
                });
                    
                describe("signinPopupCallback", () => {
                    it("should call navigator callback", async () => {
                        // arrange
                        let callbackMock = spyOn(subject.getPopupNavigator(), "callback").and.resolveTo();
                        let url = "http://app/cb?state=test&code=code";
                        let keepOpen = true;
            
                        // act
                        await subject.signinPopupCallback(url, keepOpen);
            
                        // assert
                        expect(callbackMock).toHaveBeenCalledWith(url, { keepOpen });
                    });
                });

                describe("signinSilent", () => {
                    it("should pass silentRequestTimeout from settings", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            idToken: "id_token",
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {},
                        });
            
                        Object.assign(subject.settings, {
                            silentRequestTimeoutInSeconds: 123,
                            silentRedirectUri: "http://client/silent_callback",
                        });

                        let signinSpy = spyOn(subject, 'signin').and.resolveTo(user);
            
                        // act
                        await subject.signinSilent();
                        let recent = signinSpy.calls.mostRecent();
            
                        // assert
                        expect(recent.args[1].timeoutInSeconds).toEqual(123);
                    });
            
                    it("should pass navigator params to navigator", async () => {
                        // arrange
                        let prepareMock = spyOn(subject.getIframeNavigator(), "prepare");
                        subject["signin"] = jasmine.createSpy();
                        let navParams = {
                            silentRequestTimeoutInSeconds: 234,
                        };
            
                        // act
                        await subject.signinSilent(navParams);
            
                        // assert
                        expect(prepareMock).toHaveBeenCalledWith(navParams);
                    });
            
                    it("should pass extra args to _signinStart", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {},
                        });
                        spyOn(subject.getPopupNavigator(), "prepare");
                        subject["signin"] = jasmine.createSpy().and.resolveTo(user);
                        let extraArgs = {
                            extraQueryParams: { q : "q" },
                            extraTokenParams: { t: "t" },
                            state: "state",
                            nonce: "random_nonce",
                            redirectUri: "http://app/extra_callback",
                        };
            
                        // act
                        await subject.signinSilent(extraArgs);
            
                        // assert
                        expect(subject["signin"]).toHaveBeenCalledWith(
                            {
                                requestType: "si:s",
                                prompt: "none",
                                idTokenHint: undefined,
                                ...extraArgs,
                            },
                            jasmine.objectContaining({
                                close: jasmine.any(Function),
                                navigate: jasmine.any(Function),
                            }),
                            undefined,
                        );
                    });
            
                    it("should work when having no user present", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {},
                        });
                        Object.assign(subject.settings, {
                            silentRedirectUri: "http://client/silent_callback",
                        });
                        subject["signin"] = jasmine.createSpy().and.resolveTo(user);
            
                        // act
                        await subject.signinSilent();
                    });
            
                    it("should use the refresh_token grant when a refresh token is present", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            refreshToken: "refresh_token",
                            profile: {
                                sub: "sub",
                                nickname: "Nick",
                            },
                        });
            
                        let useRefreshTokenSpy = spyOn(subject.getClient(), "useRefreshToken").and.resolveTo({
                            accessToken: "new_access_token",
                            profile: {
                                sub: "sub",
                                nickname: "Nicholas",
                            },
                        });
                        subject["loadUser"] = jasmine.createSpy().and.resolveTo(user);
            
                        // act
                        let refreshedUser = await subject.signinSilent();
                        expect(refreshedUser.accessToken).toEqual( "new_access_token");
                        expect(refreshedUser.profile.nickname).toEqual("Nicholas");
                        let args = useRefreshTokenSpy.calls.mostRecent().args;
                        expect(args[0].state.refreshToken).toEqual(user.refreshToken);
                        expect(args[0].state.sessionState).toBeNull();
                        expect(args[0].state.profile).toEqual({ "nickname": "Nick", "sub": "sub" });
                    });
            
                    it("should use the resource from settings when a refresh token is present", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            refreshToken: "refresh_token",
                            profile: {
                                sub: "sub",
                                nickname: "Nick",
                            },
                        });
            
                        let useRefreshTokenSpy = spyOn(subject.getClient(), "useRefreshToken").and.resolveTo({
                            accessTtoken: "new_access_token",
                            profile: {
                                sub: "sub",
                                nickname: "Nicholas",
                            },
                        });
                        subject["loadUser"] = jasmine.createSpy().and.resolveTo(user);
            
                        // act
                        await subject.signinSilent({ resource: "resource" });
                        let args = useRefreshTokenSpy.calls.mostRecent().args;
                        expect(args[0].state.refreshToken).toEqual(user.refreshToken);
                        expect(args[0].state.sessionState).toBeNull();
                        expect(args[0].state.resource).toEqual('resource');
                        expect(args[0].state.profile).toEqual({ "nickname": "Nick", "sub": "sub" });
                    });
                });
                      
                describe("signinSilentCallback", () => {
                    it("should call navigator callback", async () => {
                        // arrange
                        let callbackMock = spyOn(subject.getIframeNavigator(), "callback");
                        let url = "http://app/cb?state=test&code=code";
            
                        // act
                        await subject.signinSilentCallback(url);
            
                        // assert
                        expect(callbackMock).toHaveBeenCalledWith(url);
                    });
                });
            
                describe("signinCallback", () => {
                    it("should signin redirect callback for request type si:r", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {},
                        });
                        let responseState = {
                            state: { requestType: "si:r" },
                            response: { },
                        };
                        spyOn(subject.getClient(), "readSigninResponseState")
                            .and.callFake(() => Promise.resolve(responseState));
                        let signinRedirectCallbackMock = spyOn(subject, "signinRedirectCallback")
                            .and.callFake(() => Promise.resolve(user));
                        let url = "http://app/cb?state=test&code=code";
            
                        // act
                        let result = await subject.signinCallback(url);
            
                        // assert
                        expect(signinRedirectCallbackMock).toHaveBeenCalledWith(url);
                        expect(result).toEqual(user);
                    });
            
                    it("should signin popup callback for request type si:p", async () => {
                        // arrange
                        let responseState = {
                            state: { requestType: "si:p" },
                            response: { } ,
                        };
                        spyOn(subject.getClient(), "readSigninResponseState")
                            .and.callFake(() => Promise.resolve(responseState));
                        let signinPopupCallbackMock = spyOn(subject, "signinPopupCallback").and.resolveTo();
                        let url = "http://app/cb?state=test&code=code";
            
                        // act
                        let result = await subject.signinCallback(url);
            
                        // assert
                        expect(signinPopupCallbackMock).toHaveBeenCalledWith(url);
                        expect(result).toBeUndefined();
                    });
            
                    it("should signin silent callback for request type si:s", async () => {
                        // arrange
                        let responseState = {
                            state: { requestType: "si:s" },
                            response: { }
                        };
                        spyOn(subject.getClient(), "readSigninResponseState")
                            .and.callFake(() => Promise.resolve(responseState));
                        let signinRedirectCallbackMock = spyOn(subject, "signinSilentCallback").and.resolveTo();
                        let url = "http://app/cb?state=test&code=code";
            
                        // act
                        let result = await subject.signinCallback(url);
            
                        // assert
                        expect(signinRedirectCallbackMock).toHaveBeenCalledWith(url);
                        expect(result).toBeUndefined();
                    });
            
                    it("should have valid request type", async () => {
                        // arrange
                        let responseState = {
                            state: { requestType: "dummy" } ,
                            response: { } ,
                        };
                        spyOn(subject.getClient(), "readSigninResponseState")
                            .and.callFake(() => Promise.resolve(responseState));
            
                        // act
                        await expectAsync(subject.signinCallback())
                            // assert
                            .toBeRejectedWithError(Error);
                    });
                });
            
                describe("signoutCallback", () => {
                    it("should signout redirect callback for request type so:r", async () => {
                        // arrange
                        let responseState = {
                            state: { requestType: "so:r" },
                            response: { } 
                        };
                        spyOn(subject.getClient(), "readSignoutResponseState")
                            .and.callFake(() => Promise.resolve(responseState));
                        let signoutRedirectCallbackMock = spyOn(subject, "signoutRedirectCallback")
                            .and.callThrough();
                        let url = "http://app/cb?state=test&code=code";
            
                        // act
                        await subject.signoutCallback(url, true);
            
                        // assert
                        expect(signoutRedirectCallbackMock).toHaveBeenCalledWith(url);
                    });
            
                    it("should signout popup callback for request type so:p", async () => {
                        // arrange
                        let responseState = {
                            state: { requestType: "so:p" },
                            response: { } 
                        };
                        spyOn(subject.getClient(), "readSignoutResponseState")
                            .and.callFake(() => Promise.resolve(responseState));
                        let signoutPopupCallbackMock = spyOn(subject, "signoutPopupCallback")
                            .and.resolveTo();
                        let url = "http://app/cb?state=test&code=code";
                        let keepOpen = true;
            
                        // act
                        await subject.signoutCallback(url, keepOpen);
            
                        // assert
                        expect(signoutPopupCallbackMock).toHaveBeenCalledWith(url, keepOpen);
                    });
            
                    it("should have valid request type", async () => {
                        // arrange
                        let responseState = {
                            state: { requestType: "dummy" },
                            response: { } 
                        };
                        spyOn(subject.getClient(), "readSignoutResponseState")
                            .and.callFake(() => Promise.resolve(responseState));
            
                        // act
                        await expectAsync(subject.signoutCallback())
                            // assert
                            .toBeRejectedWithError('invalid response_type in state');
                    });
                });
            
                describe("signoutSilent", () => {
                    it("should pass silentRequestTimeout from settings", async () => {
                        // arrange
                        Object.assign(subject.settings, {
                            silentRequestTimeoutInSeconds: 123,
                            silentRedirectUri: "http://client/silent_callback",
                        });
                        let signoutSpy = subject["signout"] = jasmine.createSpy();
            
                        // act
                        await subject.signoutSilent();
                        let args = signoutSpy.calls.mostRecent().args;
                        expect(args[1].timeoutInSeconds).toEqual(123);
                    });
            
                    it("should pass navigator params to navigator", async () => {
                        // arrange
                        let prepareMock = spyOn(subject.getIframeNavigator(), "prepare");
                        subject["signout"] = jasmine.createSpy();
                        let navParams = {
                            silentRequestTimeoutInSeconds: 234,
                        };
            
                        // act
                        await subject.signoutSilent(navParams);
            
                        // assert
                        expect(prepareMock).toHaveBeenCalledWith(navParams);
                    });
            
                    it("should pass extra args to _signoutStart", async () => {
                        // arrange
                        spyOn(subject.getPopupNavigator(), "prepare");
                        subject["signout"] = jasmine.createSpy();
                        let extraArgs = {
                            extraQueryParams: { q : "q" },
                            state: "state",
                            postLogoutRedirectUri: "http://app/extra_callback",
                        };
            
                        // act
                        await subject.signoutSilent(extraArgs);

                        let args = subject["signout"].calls.mostRecent().args;

                        console.log('recent-ags', args)
            
                        // assert
                        expect(args[0]).toEqual({
                                requestType: "so:s",
                                popupPostLogoutRedirectUri: null,
                                idTokenHint: undefined,
                                ...extraArgs,
                        });
                        expect(args[1].close).toEqual(jasmine.any(Function));
                        expect(args[1].navigate).toEqual(jasmine.any(Function));
                        // expect(subject["signout"]).toHaveBeenCalledWith(
                        //     {
                        //         requestType: "so:s",
                        //         idTokenHint: undefined,
                        //         ...extraArgs,
                        //     },
                        //     jasmine.objectContaining({
                        //         close: jasmine.any(Function),
                        //         navigate: jasmine.any(Function),
                        //     }),
                        // );
                    });
            
                    it("should pass id_token as id_token_hint when user present and setting enabled", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            idToken: "id_token",
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {}
                        });
                        subject["loadUser"] = jasmine.createSpy().and.resolveTo(user);
                        Object.assign(subject.settings, {
                            includeIdTokenInSilentSignout: true,
                        });
                        subject["signout"] = jasmine.createSpy().and.resolveTo(user);
            
                        // act
                        await subject.signoutSilent();
            
                        // assert
                        expect(subject["signout"]).toHaveBeenCalledWith(
                            jasmine.objectContaining({
                                idTokenHint: "id_token",
                            }),
                            jasmine.anything(),
                        );
                    });
            
                    it("should not pass id_token as id_token_hint when user present but setting disabled", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            idToken: "id_token",
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {}
                        });
                        subject["loadUser"] = jasmine.createSpy().and.resolveTo(user);
                        Object.assign(subject.settings, {
                            includeIdTokenInSilentSignout: false,
                        });
                        subject["signout"] = jasmine.createSpy().and.resolveTo(user);
            
                        // act
                        await subject.signoutSilent();
            
                        // assert
                        expect(subject["signout"]).toHaveBeenCalledWith(
                            jasmine.objectContaining({
                                idTokenHint: undefined,
                            }),
                            jasmine.anything(),
                        );
                    });
                });
            
                describe("signoutSilentCallback", () => {
                    it("should call navigator callback", async () => {
                        // arrange
                        let callbackMock = spyOn(subject.getIframeNavigator(), "callback");
                        let url = "http://app/cb?state=test&code=code";
            
                        // act
                        await subject.signoutSilentCallback(url);
            
                        // assert
                        expect(callbackMock).toHaveBeenCalledWith(url);
                    });
                });
            
                describe("storeUser", () => {
                    it("should add user to store", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {}
                        });
            
                        // act
                        await subject.storeUser(user);
            
                        // assert
                        let storageString = await subject.settings.userStore.get(subject.getUserStoreKey());
                        expect(storageString).not.toBeNull();
                    });
            
                    it("should remove user from store", async () => {
                        // arrange
                        let user = Ext.create('oidc.user', {
                            accessToken: "access_token",
                            tokenType: "token_type",
                            profile: {}
                        });
                        await subject.storeUser(user);
            
                        // act
                        await subject.storeUser(null);
            
                        // assert
                        let storageString = await subject.settings.userStore.get(subject.getUserStoreKey());
                        expect(storageString).toBeNull();
                    });
                });
            
            });
        }
    }
});
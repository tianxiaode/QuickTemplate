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
                    //localStorage.clear();
            
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

                    redirectNavigatorSpy = spyOn(subject.redirectNavigator, 'getTargetWindow');
                    redirectNavigatorSpy.and.callFake((redirectTarget) => {
                        console.log('location-location-call', targetWindow)
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
                        let revokeSpy = spyOn(subject["client"], "revokeToken").and.resolveTo(undefined);
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
                        let revokeSpy = spyOn(subject["client"], "revokeToken").and.resolveTo(undefined);
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
                        let prepareMock = spyOn(subject["redirectNavigator"], "prepare");
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
                        spyOn(subject["redirectNavigator"], "prepare").and.callThrough();
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
            
            
            });
        }
    }
});
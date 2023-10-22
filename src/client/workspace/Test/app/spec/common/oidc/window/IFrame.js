Ext.define('Test.spec.common.oidc.window.IFrame', {
    singleton: true,

    requires: [
        'Common.oidc.window.IFrame'
    ],

    constructor() {
        describe('Common.oidc.window.IFrame', () => {
            let fakeWindowOrigin = "https://fake-origin.com",
                fakeUrl = "https://fakeurl.com";

            describe("hidden frame", () => {
                let frameWindow;

                beforeEach(() => {
                    frameWindow = Ext.create('oidc.window.iframe');
                });

                it("should have appropriate styles for hidden presentation", () => {
                    let { visibility, position, left, top } = frameWindow.frame.style;

                    expect(visibility).toBe("hidden");
                    expect(position).toBe("fixed");
                    expect(left).toBe("-1000px");
                    expect(top).toBe("0px");
                });

                it("should have 0 width and height", () => {
                    let { width, height } = frameWindow.frame;
                    expect(width).toBe("0");
                    expect(height).toBe("0");
                });
            });

            describe("close", () => {
                let subject,
                    parentRemoveChild = jasmine.createSpy();

                beforeEach(() => {
                    subject = Ext.create('oidc.window.iframe');
                    spyOnProperty(subject.frame, 'parentNode', 'get').and.returnValue({
                        removeChild: parentRemoveChild
                    })
                });

                it("should reset window to null", () => {
                    subject.close();
                    expect(subject.window).toBeNull();
                });

                describe("if frame defined", () => {
                    it("should set blank url for contentWindow", () => {
                        let replaceMock = jasmine.createSpy();
                        spyOnProperty(subject.frame, "contentWindow", "get")
                            .and.returnValue({ location: { replace: replaceMock } });

                        subject.close();
                        expect(replaceMock).toHaveBeenCalledWith("about:blank");
                    });

                    it("should reset frame to null", () => {
                        subject.close();
                        expect(subject.frame).toBeNull();
                    });
                });
            });

            describe("navigate", () => {

                describe("when frame.contentWindow is not defined should throw error", () => {
                    beforeEach(() => {
                        spyOn(Common.oidc.window.IFrame.prototype, 'createHiddenIframe').and.returnValue({ contentWindow: null });
                    });

                    it('should set null for contentWindow', async () => {
                        let frameWindow = Ext.create('oidc.window.iframe');
                        await expectAsync(frameWindow.navigate({}))
                            .toBeRejectedWithError("Attempted to navigate on a disposed window");
                    })

                });

                describe("when message received", () => {
                    let fakeState = "fffaaakkkeee_state",
                        fakeContentWindow = { location: { replace: jasmine.createSpy() } },
                        validNavigateParams = {
                            source: fakeContentWindow,
                            data: { source: "oidc-client", url: `https://test.com?state=${fakeState}` },
                            origin: fakeWindowOrigin,
                        },
                        navigateParamsStub = jasmine.createSpy();


                    beforeEach(() => {
                        spyOn(Common.oidc.window.Abstract, 'getLocationOrigin').and.returnValue(fakeWindowOrigin);
                        spyOn(Common.oidc.window.IFrame.prototype, 'createHiddenIframe').and.returnValue({ contentWindow: fakeContentWindow });
                        spyOn(window, "addEventListener").and.callFake((event, listener) => {
                            listener(navigateParamsStub());

                        });
                    });

                    describe("and all parameters match should resolve navigation without issues", () => {
                        [
                            ["https://custom-origin.com", "https://custom-origin.com"],
                            [fakeWindowOrigin, undefined],
                        ].forEach(([origin, scriptOrigin]) => {

                            it(origin + ' and ' + scriptOrigin, async () => {
                                navigateParamsStub.and.returnValue({ ...validNavigateParams, origin });
                                //createHiddenIframeSpy.and.returnValue({ contentWindow: fakeContentWindow });
                                let frameWindow = Ext.create('oidc.window.iframe');
                                await expectAsync(frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin })).toBeResolved();
                            });
                        })
                    });

                    describe("and message origin does not match $type should never resolve", () => {

                        [
                            { passedOrigin: undefined, type: "window origin" },
                            { passedOrigin: "https://custom-origin.com", type: "passed script origi" },
                        ].forEach((args) => {
                            it(JSON.stringify(args), async () => {
                                navigateParamsStub.and.returnValue({ ...validNavigateParams, origin: "http://different.com" });
                                let frameWindow = Ext.create('oidc.window.iframe', { timeoutInSeconds: 0.1 });
                                await expectAsync(frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin: args.passedOrigin })).toBeRejectedWith('IFrame timed out without a response');
                            });
                        })
                    });

                    it("and data url parse fails should reject with error", async () => {
                        navigateParamsStub.and.returnValue({ ...validNavigateParams, data: { ...validNavigateParams.data, url: undefined } });
                        let frameWindow = Ext.create('oidc.window.iframe', { timeoutInSeconds: 0.1 });
                        await expectAsync(frameWindow.navigate({ state: fakeState, url: fakeUrl })).toBeRejectedWith("Invalid response from window");
                    });

                    it("and args source with state do not match contentWindow should never resolve", async () => {
                        navigateParamsStub.and.returnValue({ ...validNavigateParams, source: {} });
                        let frameWindow = Ext.create('oidc.window.iframe', { timeoutInSeconds: 1 });
                        await expectAsync(frameWindow.navigate({ state: 'diff_state', url: fakeUrl })).not.toBeResolved();
                    });


                });

            });


            describe("notifyParent", () => {
                let postMessageMock = jasmine.createSpy(),
                    messageData = {
                    source: "oidc-client",
                    url: fakeUrl,
                    keepOpen: false,
                };

                beforeEach(()=>{
                    spyOn(Common.oidc.window.Abstract, 'getLocationOrigin').and.returnValue(fakeWindowOrigin);
                    spyOnProperty(window,'parent', 'get').and.returnValue({ postMessage: postMessageMock });
                })

                describe('should call postMessage with appropriate parameters', ()=>{
                    [
                        ["https://parent-domain.com", "https://parent-domain.com"],
                        [undefined, fakeWindowOrigin]
                    ].forEach(([targetOrigin, expectedOrigin])=> {
                        it(`${targetOrigin} - ${expectedOrigin}`, ()=>{
                            Common.oidc.window.IFrame.notifyParent(messageData.url, targetOrigin);
                            expect(postMessageMock).toHaveBeenCalledWith(messageData, expectedOrigin);    
                        })
                    })
                });


            });
        });

    }

});
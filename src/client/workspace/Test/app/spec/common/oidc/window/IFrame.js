Ext.define('Test.spec.common.oidc.window.IFrame', {
    singleton: true,

    requires: [
        'Common.oidc.window.IFrame'
    ],

    constructor() {
        describe('Common.oidc.window.IFrame', () => {
            let postMessageMock = jasmine.createSpy(),
                fakeWindowOrigin = "https://fake-origin.com",
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
                //let spyWindow = jasmine.createSpyObj('oidc.window.iframe', ['createHiddenIframe']);


                describe("when frame.contentWindow is not defined should throw error", () => {
                    beforeEach(() => {
                        spyOn(Common.oidc.window.IFrame.prototype, 'createHiddenIframe').and.returnValue({ contentWindow: null });
                    });

                    it('should set null for contentWindow',async ()=>{
                        let frameWindow = Ext.create('oidc.window.iframe');
                        await expectAsync(frameWindow.navigate({}))
                            .toBeRejectedWith("Attempted to navigate on a disposed window");
                    })
    
                });

                // describe("when message received", () => {
                //     let fakeState = "fffaaakkkeee_state",
                //         fakeContentWindow = { location: { replace: jasmine.createSpy() } },
                //         validNavigateParams = {
                //             source: fakeContentWindow,
                //             data: { source: "oidc-client", url: `https://test.com?state=${fakeState}` },
                //             origin: fakeWindowOrigin,
                //         },
                //         navigateParamsStub = jasmine.createSpy();

                //     beforeAll(() => {
                //         contentWindowMock.and.returnValue(fakeContentWindow);
                //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                //         spyOn(window, "addEventListener").and.callFake((event, listener)=>{
                //             console.log('spy', listener);
                //             listener(navigateParamsStub());

                //         });
                //         // .and.callFake((_, listener) => {
                //         //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                //         //     console.log('spy', listener)
                //         //     listener(navigateParamsStub());
                //         // });
                //     });

                //     it("ddd",async()=>{
                //         let origin = "https://custom-origin.com",
                //             scriptOrigin = "https://custom-origin.com";
                //         navigateParamsStub.and.returnValue({ ...validNavigateParams, origin });
                //         let frameWindow = Ext.create('oidc.window.iframe');
                //         await expectAsync(frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin })).not.toBeResolved();


                //     });

                //     // describe("and all parameters match should resolve navigation without issues", ()=>{
                //     //     it("ddd",async()=>{
                //     //         let origin = "https://custom-origin.com",
                //     //             scriptOrigin = "https://custom-origin.com";
                //     //         navigateParamsStub.and.returnValue({ ...validNavigateParams, origin });
                //     //         let frameWindow = Ext.create('oidc.window.iframe');
                //     //         let promise = frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin });
                //     //         await expectAsync(promise).not.toBeResolved();


                //     //     });
                //         // [
                //         //     ["https://custom-origin.com", "https://custom-origin.com" ],
                //         //     [ fakeWindowOrigin, undefined],
                //         // ].forEach(([origin, scriptOrigin])=>{
                //         //     it(origin + ' and ' + scriptOrigin, async()=>{
                //         //         navigateParamsStub.and.returnValue({ ...validNavigateParams, origin });
                //         //         let frameWindow = Ext.create('oidc.window.iframe');
                //         //         await expectAsync(frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin })).not.toBeResolved();
                //         //     });
                //         // })
                //     //});

                //     // describe("and message origin does not match $type should never resolve", ()=>{
                //     //     [
                //     //         { passedOrigin: undefined, type: "window origin" },
                //     //         { passedOrigin: "https://custom-origin.com", type: "passed script origi" },
                //     //     ].forEach((args)=>{
                //     //         it(JSON.stringify(args), async()=>{
                //     //             let promiseDone = false;
                //     //             navigateParamsStub.and.returnValue({ ...validNavigateParams, origin: "http://different.com" });
                //     //             let frameWindow = Ext.create('oidc.window.iframe');
                //     //             await expectAsync(frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin:args.passedOrigin })).not.toBeResolved();
                //     //             // let promise = frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin: args.passedOrigin });
                //     //             // void promise.finally(() => promiseDone = true);
                //     //             // await flushPromises();
                
                //     //             // expect(promiseDone).toBeFalse();
                
                //     //         });
                //     //     })
                //     // });

        
                // });
        
            });

        });

    }

});
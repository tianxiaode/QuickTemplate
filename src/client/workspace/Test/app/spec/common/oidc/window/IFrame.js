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

                beforeAll(() => {
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
                    const { width, height } = frameWindow.frame;
                    expect(width).toBe("0");
                    expect(height).toBe("0");
                });
            });

            describe("close", () => {
                let subject;
                beforeEach(() => {
                    subject = Ext.create('oidc.window.iframe');
                    spyOn(subject.frame.parentNode, "removeChild").and.returnValue(Ext.isEmpty);
                });

                it("should reset window to null", () => {
                    subject.close();
                    expect(subject.window).toBeNull();
                });

                describe("if frame defined", () => {
                    it("should reset frame to null", () => {
                        subject.close();
                        expect(subject.frame).toBeNull();
                    });
                });
            });

            describe("navigate", () => {

                describe("when message received", () => {
                    let spy,
                        fakeState = "fffaaakkkeee_state",
                        fakeContentWindow = { location: { replace: jasmine.createSpy() } },
                        validNavigateParams = {
                            source: fakeContentWindow,
                            data: {
                                source: "oidc-client",
                                url: `https://test.com?state=${fakeState}`
                            },
                            origin: fakeWindowOrigin,
                        },
                        navigateParamsStub = jasmine.createSpy();

                    beforeAll(() => {
                        //contentWindowMock.addEventListener.and.callFake(navigateParamsStub);

                        //spy = spyOn(window, "addEventListener");


                        //contentWindowMock.and.returnValue(fakeContentWindow);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        // spyOn(window, "addEventListener").and.callFake((_, listener) => {
                        //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call  
                        //     listener(navigateParamsStub());
                        // });
                    });

                    // afterAll(() => {
                    //     spy.and.returnValue(navigateParamsStub());
                    // });

                    it('dd', async () => {
                        let origin = "https://custom-origin.com",
                            scriptOrigin = fakeWindowOrigin;
                        navigateParamsStub.and.returnValue({ ...validNavigateParams, origin });
                        let frameWindow = Ext.create('oidc.window.iframe');
                        let abc = spyOn(window, "addEventListener");
                        console.log(abc)
                    
                        let a = await frameWindow.navigate({ state: fakeState, url: fakeUrl, scriptOrigin });
                        abc.
                        console.log(a)
                        //   // Now you can use window.location in your test as if it were a real object
                        //   expect(window.location.href).toEqual('https://example.com');
                        //   expect(window.location.pathname).toEqual('/some/path');                        
                    })

                });



            });

        });

    }

});
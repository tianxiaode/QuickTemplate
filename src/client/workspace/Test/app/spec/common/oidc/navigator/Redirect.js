Ext.define('Test.spec.common.oidc.navigator.Redirect', {
    singleton: true,

    requires: [
        'Common.oidc.navigator.Redirect'
    ],

    constructor() {
        describe('Common.oidc.navigator.Redirect', () => {
            let url = 'http://sts/authorize',
                settings = { redirectMethod: "assign" },
                targetWindow = {
                    location:{
                        redirect: jasmine.createSpy(),
                        assign: jasmine.createSpy(),
                        replace: jasmine.createSpy()
                    },
                    parent:{
                        location:{
                            redirect: jasmine.createSpy(),
                            assign: jasmine.createSpy(),
                            replace: jasmine.createSpy()
                        }
                    },
                    top: { 
                        location:{
                            redirect: jasmine.createSpy(),
                            assign: jasmine.createSpy(),
                            replace: jasmine.createSpy()
                        }
                    },
                    stop: jasmine.createSpy()
                },
                navigator,
                navigatorSpy;

            beforeEach(()=>{
                navigator = Ext.create('oidc.navigator.redirect', settings);
                navigatorSpy = spyOn(navigator, 'getTargetWindow');
                console.log(navigatorSpy)
                navigatorSpy.and.callFake((redirectTarget)=>{
                    return redirectTarget === 'top' ? targetWindow.top ?? targetWindow : targetWindow;
                });
            })

            // afterEach(()=>{
            //     navigatorSpy.and.reset();
            // })

        
            it("should redirect to the authority server using the default redirect method", async () => {
                let handle = await navigator.prepare({});
                handle.navigate({ url: url });
        
                expect(targetWindow.location.assign).toHaveBeenCalledWith(url);
            });
        
            it("should redirect to the authority server using a specific redirect method", async () => {
                let handle = await navigator.prepare({ redirectMethod: "replace" });
                let spy = jasmine.createSpy();
                //targetWindow.location.replace.and.returnValue(Promise.reject());
                handle.navigate({ url: url }).finally(spy);
        
                expect(targetWindow.location.replace).toHaveBeenCalledWith(url);
        
                // We check that the promise does not resolve even after the window
                // unload event
                //await once(window, "unload");                
                expect(spy).not.toHaveBeenCalled();
            });
        
            it("should redirect to the authority server from window top", async () => {
                const handle = await navigator.prepare({ redirectTarget: "top" });
                const spy = jasmine.createSpy();
                void handle.navigate({ url: "http://sts/authorize" }).finally(spy);

                navigatorSpy.calls.mostRecent();
        
                expect(targetWindow.location.assign).toHaveBeenCalledTimes(0);
                expect(targetWindow.parent.location.assign).not.toHaveBeenCalled();
                expect(targetWindow.top.location.assign).toHaveBeenCalledWith("http://sts/authorize");
        
                // We check that the promise does not resolve even after the window
                // unload event
                // await once(window, "unload");
                expect(spy).not.toHaveBeenCalled();
            });
        
            it("should reject when the navigation is stopped programmatically", async () => {
                targetWindow.location.assign.and.returnValue(undefined);
                const handle = await navigator.prepare({});
                const promise = handle.navigate({ url: "http://sts/authorize" });
        
                handle.close();
                await expectAsync(promise).toBeRejectedWithError("Redirect aborted");
            });
        
        });

    }

});
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
                    location: { 
                        redirect: jasmine.createSpy(),
                        assign: jasmine.createSpy(),
                        replace: jasmine.createSpy()
                    } 
                },
                navigator;

            beforeEach(()=>{
                navigator = Ext.create('oidc.navigator.redirect', settings),
                spyOn(navigator, 'getTargetWindow').and.returnValue(targetWindow);
            })
        
            it("should redirect to the authority server using the default redirect method", async () => {
                let handle = await navigator.prepare({});
                handle.navigate({ url: url });
        
                expect(targetWindow.location.assign).toHaveBeenCalledWith(url);
            });
        
            it("should redirect to the authority server using a specific redirect method", async () => {
                let handle = await navigator.prepare({ redirectMethod: "replace" });
                let spy = jasmine.createSpy();
                handle.navigate({ url: url }).finally(spy);
        
                expect(targetWindow.location.replace).toHaveBeenCalledWith(url);
        
                // We check that the promise does not resolve even after the window
                // unload event
                await once(window, "unload");
                expect(spy).not.toHaveBeenCalled();
            });
        
            // it("should redirect to the authority server from window top", async () => {
        
            //     Object.defineProperty(window, "top", {
            //         value: {
            //             location: {
            //                 assign: jasmine.createSpy(),
            //             },
            //         },
            //     });
        
            //     const handle = await navigator.prepare({ redirectTarget: "top" });
            //     const spy = jest.fn();
            //     void handle.navigate({ url: "http://sts/authorize" }).finally(spy);
        
            //     expect(window.location.assign).toHaveBeenCalledTimes(0);
            //     expect(window.parent.location.assign).toHaveBeenCalledTimes(0);
            //     expect(window.top.location.assign).toHaveBeenCalledWith("http://sts/authorize");
        
            //     // We check that the promise does not resolve even after the window
            //     // unload event
            //     await once(window, "unload");
            //     expect(spy).not.toHaveBeenCalled();
            // });
        
            // it("should reject when the navigation is stopped programmatically", async () => {
            //     const handle = await navigator.prepare({});
            //     mocked(window.location.assign).mockReturnValue(undefined);
            //     const promise = handle.navigate({ url: "http://sts/authorize" });
        
            //     handle.close();
            //     await expect(promise).rejects.toThrow("Redirect aborted");
            // });
        
        });

    }

});
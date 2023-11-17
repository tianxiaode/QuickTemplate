Ext.define('Test.spec.common.oidc.window.Popup', {

    requires: [
        'Common.oidc.window.Popup'
    ],
    statics: {
        run() {


            describe("PopupWindow", () => {
                let spyWindowOpen,
                    tick = (millis, fn) => {
                        jasmine.clock().uninstall();
                        jasmine.clock().install();
                        //延迟后续代码执行，等等setTimeout代码执行
                        jasmine.clock().tick(millis);
                        fn();
                        jasmine.clock().uninstall();
                    };
                beforeEach(() => {
                    spyOn(Common.oidc.window.Abstract, 'getLocationOrigin').and.returnValue("http://app");

                    window.opener = {
                        postMessage: jasmine.createSpy(),
                    };
                    spyWindowOpen = spyOn(window, 'open');
                    spyWindowOpen.and.returnValue({
                        location: { replace: jasmine.createSpy() },
                        focus: jasmine.createSpy(),
                        close: jasmine.createSpy(),
                    })
                });

                it("should open a popup", () => {
                    Ext.create('oidc.window.popup');
                    expect(window.open).toHaveBeenCalled();
                });

                it("should resolve when navigate succeeds", async () => {
                    let popupWindow = Ext.create('oidc.window.popup');

                    let promise = popupWindow.navigate({ url: "http://sts/authorize?x=y", state: "someid" });

                    window.dispatchEvent(new MessageEvent("message", {
                        data: { source: "oidc-client", url: "http://app/cb?state=someid" },
                        origin: "http://app",
                    }));

                    await expectAsync(promise).toBeResolvedTo({ url: "http://app/cb?state=someid" });
                    let popupFromWindowOpen = spyWindowOpen.calls.first().returnValue;
                    expect(popupFromWindowOpen.location.replace).toHaveBeenCalledWith("http://sts/authorize?x=y");
                    expect(popupFromWindowOpen.focus).toHaveBeenCalled();
                    expect(popupFromWindowOpen.close).toHaveBeenCalled();
                });

                it("should keep the window open after navigate succeeds", async () => {
                    let popupWindow = Ext.create('oidc.window.popup');

                    let promise = popupWindow.navigate({ url: "http://sts/authorize?x=y", state: "someid" });

                    window.dispatchEvent(new MessageEvent("message", {
                        data: { source: "oidc-client", url: "http://app/cb?state=someid", keepOpen: true },
                        origin: "http://app",
                    }));

                    await expectAsync(promise).toBeResolvedTo({ url: "http://app/cb?state=someid" });
                    let popupFromWindowOpen = spyWindowOpen.calls.first().returnValue;
                    expect(popupFromWindowOpen.location.replace).toHaveBeenCalledWith("http://sts/authorize?x=y");
                    expect(popupFromWindowOpen.close).not.toHaveBeenCalled();
                });

                it("should ignore messages from foreign origins", async () => {
                    let popupWindow = Ext.create('oidc.window.popup');

                    let promise = popupWindow.navigate({ url: "http://sts/authorize?x=y", state: "someid" });

                    window.dispatchEvent(new MessageEvent("message", {
                        data: { source: "oidc-client", url: "http://app/cb?state=someid&code=foreign-origin" },
                        origin: "http://foreign-origin",
                    }));
                    window.dispatchEvent(new MessageEvent("message", {
                        data: { source: "foreign-lib", url: "http://app/cb?state=someid&code=foreign-lib" },
                        origin: "http://app",
                        source: (new MessageChannel()).port1
                    }));
                    window.dispatchEvent(new MessageEvent("message", {
                        data: { source: "oidc-client", url: "http://app/cb?state=someid&code=code" },
                        origin: "http://app",
                    }));

                    await expectAsync(promise).toBeResolvedTo({ url: "http://app/cb?state=someid&code=code" });
                    let popupFromWindowOpen = spyWindowOpen.calls.first().returnValue;
                    expect(popupFromWindowOpen.focus).toHaveBeenCalled();
                    expect(popupFromWindowOpen.close).toHaveBeenCalled();
                });

                it("should reject when navigate fails", async () => {
                    let popupWindow = Ext.create('oidc.window.popup');

                    let promise = popupWindow.navigate({ url: "http://sts/authorize?x=y", state: "someid" });
                    let popupFromWindowOpen = spyWindowOpen.calls.first().returnValue;
                    window.dispatchEvent(new MessageEvent("message", {
                        data: { source: "oidc-client", url: "" },
                        origin: "http://app",
                        source: window,
                    }));

                    await expectAsync(promise).toBeRejectedWith("Invalid response from window");
                    expect(popupFromWindowOpen.location.replace).toHaveBeenCalledWith("http://sts/authorize?x=y");
                });

                it("should reject when the window is closed by user", async () => {
                    spyWindowOpen.and.returnValue({
                        location: { replace: jasmine.createSpy() },
                        focus: jasmine.createSpy(),
                        close: jasmine.createSpy(),
                        closed: true
                    });

                    let popupWindow = Ext.create('oidc.window.popup');

                    let promise = popupWindow.navigate({ url: "http://sts/authorize?x=y", state: "someid" });
                    await expectAsync(promise).toBeRejectedWith("Popup closed by user");
                });

                it("should reject when the window is closed programmatically", async () => {
                    let popupWindow = Ext.create('oidc.window.popup');

                    let promise = popupWindow.navigate({ url: "http://sts/authorize?x=y", state: "someid" });
                    popupWindow.close();

                    await expectAsync(promise).toBeRejectedWith("Popup closed");
                });

                it("should notify the parent window", async () => {
                    Common.oidc.window.Popup.notifyOpener("http://sts/authorize?x=y", false);
                    expect((window.opener).postMessage).toHaveBeenCalledWith({
                        source: "oidc-client",
                        url: "http://sts/authorize?x=y",
                        keepOpen: false,
                    }, Oidc.Window.getLocationOrigin());
                });

                it("should run setTimeout when closePopupWindowAfterInSeconds is greater than 0", async () => {
                    let spySetTimeout = spyOn(window, 'setTimeout');
                    Ext.create('oidc.window.popup', { features: { closePopupWindowAfterInSeconds: 1 } });
                    tick(1001, () => {
                        expect(spySetTimeout).toHaveBeenCalledTimes(1);
                    })

                });

                it("shouldn't run setTimeout when closePopupWindowAfterInSeconds is equal to 0", async () => {
                    let spySetTimeout = spyOn(window, 'setTimeout');

                    Ext.create('oidc.window.popup', { features: { closePopupWindowAfterInSeconds: 0 } });
                    tick(1, () => {
                        expect(spySetTimeout).toHaveBeenCalledTimes(0);
                    })


                });

                it("shouldn't run setTimeout when closePopupWindowAfterInSeconds is less than 0", async () => {
                    let spySetTimeout = spyOn(window, 'setTimeout');

                    Ext.create('oidc.window.popup', { features: { closePopupWindowAfterInSeconds: -120 } });
                    tick(1, () => {
                        expect(spySetTimeout).toHaveBeenCalledTimes(0);
                    })

                });

                it("should invoke close popup window when closePopupWindowAfterInSeconds is greater than 0 and window is open", (done) => {
                    spyWindowOpen.and.returnValue({
                        location: { replace: jasmine.createSpy() },
                        focus: jasmine.createSpy(),
                        close: jasmine.createSpy(),
                        closed: false
                    });
                    let popupWindow = Ext.create('oidc.window.popup', { features: { closePopupWindowAfterInSeconds: 1 } });
                    let closeWindowSpy = spyOn(popupWindow, 'close');
                    setTimeout(() => {
                        expect(closeWindowSpy).toHaveBeenCalledTimes(1);
                        done();
                    }, 1001)
                });

                it("shouldn't invoke close popup window when closePopupWindowAfterInSeconds is greater than 0 and window is not open", (done) => {
                    spyWindowOpen.and.returnValue({
                        location: { replace: jasmine.createSpy() },
                        focus: jasmine.createSpy(),
                        close: jasmine.createSpy(),
                        closed: true
                    });
                    let popupWindow = Ext.create('oidc.window.popup', { features: { closePopupWindowAfterInSeconds: 1 } });
                    let closeWindowSpy = spyOn(popupWindow, 'close');
                    setTimeout(() => {
                        expect(closeWindowSpy).toHaveBeenCalledTimes(0);
                        done();
                    }, 1001)

                });

                it("should show error when closePopupWindowAfterInSeconds is greater than 0 and window is not open", async () => {
                    Logger.setLevel('debug');
                    let popupWindow = Ext.create('oidc.window.popup', { features: { closePopupWindowAfterInSeconds: 1 } });
                    let consoleDebugSpy = spyOn(console, "debug");
                    let promise = popupWindow.navigate({ url: "http://sts/authorize?x=y", state: "someid" });


                    await expectAsync(promise).toBeRejectedWith("Popup blocked by user");
                    expect(consoleDebugSpy).toHaveBeenCalled();
                });

            });

        }
    }
});
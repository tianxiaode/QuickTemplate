Ext.define('Test.spec.common.oidc.util.Popup', {

    requires: [
        'Common.oidc.util.Popup'
    ],
    statics: {
        run() {
            describe('Common.oidc.util.Popup', () => {
                describe("center", () => {
                    it("should center a window to integer offsets", () => {
                        Object.defineProperties(window, {
                            screenX: { enumerable: true, value: 50 },
                            screenY: { enumerable: true, value: 50 },
                            outerWidth: { enumerable: true, value: 101 },
                            outerHeight: { enumerable: true, value: 101 },
                        });
                        let features = Oidc.Popup.center({
                            width: 100,
                            height: 100,
                        });

                        expect(features.left).toBe(51);
                        expect(features.top).toBe(51);
                    });

                    it("should restrict window placement to nonnegative offsets", () => {
                        Object.defineProperties(window, {
                            screenX: { enumerable: true, value: 0 },
                            screenY: { enumerable: true, value: 0 },
                            outerWidth: { enumerable: true, value: 50 },
                            outerHeight: { enumerable: true, value: 50 },
                        });
                        let features = Oidc.Popup.center({
                            width: 100,
                            height: 100,
                        });

                        expect(features.left).toBe(0);
                        expect(features.top).toBe(0);
                    });
                });

                describe("serialize", () => {
                    it("should encode boolean values as yes/no", () => {
                        let result = Oidc.Popup.serialize({ foo: true, bar: false });

                        expect(result).toEqual("foo=yes,bar=no");
                    });

                    it("should omit undefined properties", () => {
                        let result = Oidc.Popup.serialize({ foo: true, bar: undefined });

                        expect(result).toEqual("foo=yes");
                    });

                    it("should preserve numerical and string values", () => {
                        let result = Oidc.Popup.serialize({ foo: "yes", bar: 0, baz: 20, quux: "" });

                        expect(result).toEqual("foo=yes,bar=0,baz=20,quux=");
                    });
                });

            });
        }
    }
});
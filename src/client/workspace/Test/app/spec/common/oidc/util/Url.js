Ext.define('Test.spec.common.oidc.util.Url', {
    requires: [
        'Common.oidc.util.Url'
    ],

    statics: {
        run() {
            describe("Common.oidc.util.Url", () => {

                describe("readUrlParams", () => {
                    let UrlUtils = Common.oidc.util.Url;
                    it("should return query params by default", () => {
                        // act
                        const result = UrlUtils.readParams("http://app/?foo=test");
                        const resultObj = Object.fromEntries(result);
            
                        // assert
                        expect(resultObj.foo).toEqual("test");
                    });
            
                    it("should return fragment params for response_mode=fragment", () => {
                        // act
                        const result = UrlUtils.readParams("http://app/?foo=test#bar=test_fragment", "fragment");
                        const resultObj = Object.fromEntries(result);
            
                        // assert
                        expect(resultObj.bar).toEqual("test_fragment");
                    });
            
                    it("should return query params when path is relative", () => {
                        // act
                        const result = UrlUtils.readParams("/app/?foo=test");
                        const resultObj = Object.fromEntries(result);
            
                        // assert
                        expect(resultObj.foo).toEqual("test");
                    });
            
                    it("should return fragment params for response_mode=fragment when path is relative", () => {
                        // act
                        const result = UrlUtils.readParams("/app/?foo=test#bar=test_fragment", "fragment");
                        const resultObj = Object.fromEntries(result);
            
                        // assert
                        expect(resultObj.bar).toEqual("test_fragment");
                    });
            
                    it("should throw an error when url is undefined", () => {
                        // act
                        const call = () => UrlUtils.readParams("");
            
                        // assert
                        expect(call).toThrow(new Error("Invalid URL"));
                    });
            
                });
            });
            
        }
    }
});
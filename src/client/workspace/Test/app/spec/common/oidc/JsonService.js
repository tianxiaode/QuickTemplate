Ext.define('Test.spec.common.oidc.JsonService', {
    singleton: true,

    requires: [
        'Common.oidc.JsonService'
    ],

    constructor() {
        describe('Common.oidc.JsonService', () => {
            let subject;
            let customStaticHeaderSubject;
            let customDynamicHeaderSubject;
            let url = 'http://test';
        
            let staticExtraHeaders = {
                "Custom-Header-1": "this-is-header-1",
                "Custom-Header-2": "this-is-header-2",
                "acCept" : "application/fake",
                "AuthoriZation" : "not good",
                "Content-Type": "application/fail",
            };
            let dynamicExtraHeaders = {
                "Custom-Header-1": () => "my-name-is-header-1",
                "Custom-Header-2": () => {
                    return "my-name-is-header-2";
                },
                "acCept" : () => "nothing",
                "AuthoriZation" : () => "not good",
                "Content-Type": "application/fail",
            };
        
            beforeEach(() =>{
                subject = Ext.create('oidc.jsonservice');
                customStaticHeaderSubject = Ext.create('oidc.jsonservice',{extraHeaders: staticExtraHeaders});
                customDynamicHeaderSubject = Ext.create('oidc.jsonservice',{extraHeaders: dynamicExtraHeaders});
                spyOn(Ext.Ajax, 'request');
            });
        
            describe("getJson", () => {
                it("should make GET request to url", async () => {
                    // act
                    await expectAsync(subject.getJson({url: url})).toBeRejected();
        
                    // assert
                    expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        url: url,
                        method: 'GET',
                        headers: { Accept: "application/json"}
                    });
                });
        
                it("should make GET request to url with static custom headers", async () => {
                    // act
                    await expectAsync(customStaticHeaderSubject.getJson({url: url})).toBeRejected();
        
                    // assert
                    expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        url: url,
                        headers: { 
                            Accept: "application/json",
                            "Custom-Header-1": "this-is-header-1",
                            "Custom-Header-2": "this-is-header-2"
                        },
                        method: "GET"
                    });
        
                });
        
                it("should make GET request to url with dynamic custom headers", async () => {
                    // act
                    await expectAsync(customDynamicHeaderSubject.getJson({ url: url })).toBeRejected();
        
                    // assert
                    expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        url: url,
                        headers: { 
                            Accept: "application/json",
                            "Custom-Header-1": "my-name-is-header-1",
                            "Custom-Header-2": "my-name-is-header-2"
                        },
                        method: "GET"
                    });
                });

                it("should set token as authorization header", async () => {
                    // act
                    await expectAsync(subject.getJson({ url: url, token: "token" })).toBeRejected();
        
                    // assert
                    expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        url: url,
                        token: 'token',
                        headers: { Accept: "application/json", Authorization: "Bearer token" },
                        method: "GET"
                    });
                });
        
        
            });
        

            
        });


    
    }

});
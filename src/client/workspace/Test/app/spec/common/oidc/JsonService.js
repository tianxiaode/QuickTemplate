Ext.define('Test.spec.common.oidc.JsonService', {

    requires: [
        'Common.oidc.JsonService'
    ],

    statics:{
        run(){
            describe('Common.oidc.JsonService',  () => {

                let subject;
                let customStaticHeaderSubject;
                let customDynamicHeaderSubject;
                let url = 'http://test';
                let url2 = 'http://fake.com/test'
            
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
                    jasmine.Ajax.install();
                    subject = Ext.create('oidc.jsonservice');
                    customStaticHeaderSubject = Ext.create('oidc.jsonservice',{extraHeaders: staticExtraHeaders});
                    customDynamicHeaderSubject = Ext.create('oidc.jsonservice',{extraHeaders: dynamicExtraHeaders});
                    spyOn(Ext.Ajax, 'request');
                });
    
                afterEach(() => {
                    jasmine.Ajax.uninstall();
                })
    
        
                
                    describe("getJson", () => {
                        // it("should make GET request to url", async () => {
                        //     // act
        
                        //     await expectAsync(subject.getJson({url: url})).toBeRejected();
                
                        //     // assert
                        //     expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        //         url: url,
                        //         method: 'GET',
                        //         headers: { Accept: "application/json"}
                        //     });
                        // });
                
                        // it("should make GET request to url with static custom headers", async () => {
                        //     // act
                        //     await expectAsync(customStaticHeaderSubject.getJson({url: url})).toBeRejected();
                
                        //     // assert
                        //     expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        //         url: url,
                        //         headers: { 
                        //             Accept: "application/json",
                        //             "Custom-Header-1": "this-is-header-1",
                        //             "Custom-Header-2": "this-is-header-2"
                        //         },
                        //         method: "GET"
                        //     });
                
                        // });
                
                        // it("should make GET request to url with dynamic custom headers", async () => {
                        //     // act
                        //     await expectAsync(customDynamicHeaderSubject.getJson({ url: url })).toBeRejected();
                
                        //     // assert
                        //     expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        //         url: url,
                        //         headers: { 
                        //             Accept: "application/json",
                        //             "Custom-Header-1": "my-name-is-header-1",
                        //             "Custom-Header-2": "my-name-is-header-2"
                        //         },
                        //         method: "GET"
                        //     });
                        // });
        
                        // it("should set token as authorization header", async () => {
                        //     // act
                        //     await expectAsync(subject.getJson({ url: url, token: "token" })).toBeRejected();
                
                        //     // assert
                        //     expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        //         url: url,
                        //         token: 'token',
                        //         headers: { Accept: "application/json", Authorization: "Bearer token" },
                        //         method: "GET"
                        //     });
                        // });        
                
                        // it("should set token as authorization header with static custom headers", async () => {
                        //     // act
                        //     await expectAsync(customStaticHeaderSubject.getJson({url: url, token: "token" })).toBeRejected();
                
                        //     // assert
                        //     expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        //         url: url,
                        //         token: 'token',
                        //         headers: { 
                        //             Accept: "application/json",
                        //             Authorization: "Bearer token",
                        //             "Custom-Header-1": "this-is-header-1",
                        //             "Custom-Header-2": "this-is-header-2"
                        //         },
                        //         method: "GET"
                        //     })
                        // });
        
                        // it("should set token as authorization header with dynamic custom headers", async () => {
                        //     // act
                        //     await expectAsync(customDynamicHeaderSubject.getJson({url: url, token: "token" })).toBeRejected();
                
                        //     // assert
                        //     expect(Ext.Ajax.request).toHaveBeenCalledWith({
                        //         url: url,
                        //         token: 'token',
                        //         headers: { 
                        //             Accept: "application/json", 
                        //             Authorization: "Bearer token",
                        //             "Custom-Header-1": "my-name-is-header-1",
                        //             "Custom-Header-2": "my-name-is-header-2"
                        //         },
                        //         method: "GET"
                        //     });
                        // });
                
                        describe("should fulfill promise when http response is 200", () => {
                            let json = { foo: 1, bar: "test" };
        
                            beforeEach(() => {
                                console.log('beforeeach')
                            })
            
                            it('验证返回数据',(abc) => {
                                console.log('Http.get',Http.get)            
                               let a = Http.get(URI.get('application-configuration'));
                               a.then((response)=>{ cosnole.log('re-test',response);
                                abc();}, (response)=>{ 
                                    console.log('re-reject', response);
                                    expert(response).toBeDefined();
                                    abc(); 
                                })
                               
                                //let result = await subject.getJson({url: url});
                                // assert
                                //expect(result).toEqual(json);
                            });
                        });                            
                
                    });
    
    
                
            });
    
        }
    }


});
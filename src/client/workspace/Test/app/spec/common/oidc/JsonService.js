Ext.define('Test.spec.common.oidc.JsonService', {

    requires: [
        'Common.oidc.JsonService'
    ],

    statics: {
        run() {
            describe('Common.oidc.JsonService', () => {

                let url = 'http://test';
                let request, result;
                let rejectResponse = {
                    status: 500,
                    statusText: "server error"    
                };

                let staticExtraHeaders = {
                    "Custom-Header-1": "this-is-header-1",
                    "Custom-Header-2": "this-is-header-2",
                    "acCept": "application/fake",
                    "AuthoriZation": "not good",
                    "Content-Type": "application/fail",
                };
                let dynamicExtraHeaders = {
                    "Custom-Header-1": () => "my-name-is-header-1",
                    "Custom-Header-2": () => {
                        return "my-name-is-header-2";
                    },
                    "acCept": () => "nothing",
                    "AuthoriZation": () => "not good",
                    "Content-Type": "application/fail",
                };
                let subject = Ext.create('oidc.jsonservice');
                let customStaticHeaderSubject = Ext.create('oidc.jsonservice', { extraHeaders: staticExtraHeaders });
                let customDynamicHeaderSubject = Ext.create('oidc.jsonservice', { extraHeaders: dynamicExtraHeaders });

                beforeEach(() => {
                    jasmine.Ajax.install();
                });

                afterEach(() => {
                    jasmine.Ajax.uninstall();
                })



                describe("getJson", () => {
                    describe("should make GET request to url", () => {
                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = subject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })
                        
                        it("测试", async() =>{
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'GET',
                                params: null,
                                headers: { Accept: "application/json" }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();    
    
                        } )

                    });

                    describe("should make GET request to url with static custom headers", () => {

                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = customStaticHeaderSubject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async() =>{
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'GET',
                                params: null,
                                headers: { 
                                    Accept: "application/json",
                                    "Custom-Header-1": "this-is-header-1",
                                    "Custom-Header-2": "this-is-header-2"
                                }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();    
    
                        });
                    });

                    describe("should make GET request to url with dynamic custom headers", () => {

                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = customDynamicHeaderSubject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async() =>{
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'GET',
                                params: null,
                                headers: { 
                                    Accept: "application/json",
                                    "Custom-Header-1": "my-name-is-header-1",
                                    "Custom-Header-2": "my-name-is-header-2"
                                    }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();    
    
                        });
                    });

                    describe("should set token as authorization header", () => {

                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = subject.getJson(url, 'token');
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async() =>{
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                headers: { Accept: "application/json", Authorization: "Bearer token" },
                                method: "GET",
                                params: null
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();    
    
                        });

                    });        

                    describe("should set token as authorization header with static custom headers", () => {

                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = customStaticHeaderSubject.getJson(url, 'token');
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async() =>{
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                headers: { 
                                    Accept: "application/json",
                                    Authorization: "Bearer token",
                                    "Custom-Header-1": "this-is-header-1",
                                    "Custom-Header-2": "this-is-header-2"
                                },
                                    method: "GET",
                                params: null
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();    
    
                        });

                    });

                    describe("should set token as authorization header with dynamic custom headers", () => {
                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = customDynamicHeaderSubject.getJson(url, 'token');
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async() =>{
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                headers: { 
                                    Accept: "application/json", 
                                    Authorization: "Bearer token",
                                    "Custom-Header-1": "my-name-is-header-1",
                                    "Custom-Header-2": "my-name-is-header-2"
                                },
                                    method: "GET",
                                params: null
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();    
    
                        });

                    });

                    describe("should fulfill promise when http response is 200", () => {
                        let json = { foo: 1, bar: "test" };
   
                        beforeEach(() => {
                            result = subject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();

                        })


                        it('验证返回数据', async () => {
                            request.respondWith({
                                status: 200,
                                ok: true,
                                headers: new Headers({
                                    "Content-Type": "application/json",
                                }),
                                responseText: JSON.stringify(json)
                            });

                            await expectAsync(result).toBeResolvedTo(json);
                        });
                    });

                });



            });

        }
    }


});
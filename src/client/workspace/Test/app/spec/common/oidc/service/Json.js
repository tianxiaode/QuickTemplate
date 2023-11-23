Ext.define('Test.spec.common.oidc.service.Json', {
    requires: [
        'Common.oidc.service.Json'
    ],

    statics: {
        run() {
            describe('Common.oidc.service.Json', () => {

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
                let subject = Ext.create('oidc.service.json');
                let customStaticHeaderSubject = Ext.create('oidc.service.json', null, null, staticExtraHeaders);
                let customDynamicHeaderSubject = Ext.create('oidc.service.json', null, null, dynamicExtraHeaders);

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

                        it("测试", async () => {
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'GET',
                                params: null,
                                headers: { Accept: "application/json" }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();

                        })

                    });

                    describe("should make GET request to url with static custom headers", () => {

                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = customStaticHeaderSubject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async () => {
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

                        it("测试", async () => {
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

                        it("测试", async () => {
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

                        it("测试", async () => {
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

                        it("测试", async () => {
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
                                responseText: JSON.stringify(json)
                            });

                            await expectAsync(result).toBeResolvedTo(json);
                        });
                    });

                    describe("should reject promise when http response is 200 and json is not able to parse", () => {
                        let error = new SyntaxError("Unexpected token a in JSON");

                        beforeEach(() => {
                            result = subject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 200,
                                responseText: error
                            });

                            await expectAsync(result).toBeRejectedWith(new Error(error));
                        });

                    });

                    describe("should reject promise when http response is not 200", () => {
                        beforeEach(() => {
                            result = subject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 500,
                                statusText: "server error",
                                responseText: null
                            });

                            await expectAsync(result).toBeRejectedWith(new Error('server error (500)'));
                        });

                    });

                    describe("should reject promise when http response content type is not json", () => {
                        let json = { foo: 1, bar: "test" };

                        beforeEach(() => {
                            result = subject.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 200,
                                contentType: "text/html",
                                responseText: JSON.stringify(json)
                            });

                            await expectAsync(result).toBeRejectedWith(new Error(`Invalid response Content-Type: text/html, from URL: ${url}`));
                        });
                    });

                    describe("should accept custom content type in response", () => {
                        let json = { foo: 1, bar: "test" };
                        let subject2;

                        beforeEach(() => {
                            subject2 = Ext.create('oidc.service.json', ["foo/bar"]);
                            result = subject2.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 200,
                                contentType: "foo/bar",
                                responseText: JSON.stringify(json)
                            });

                            await expectAsync(result).toBeResolvedTo(json);
                        });

                    });

                    describe("should work with custom jwtHandler", () => {
                        let text = 'text';
                        let subject3;

                        beforeEach(() => {
                            subject3 = Ext.create('oidc.service.json', null, () => { });
                            result = subject3.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                            spyOn(subject3, 'jwtHandler');
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 200,
                                contentType: "application/jwt",
                                responseText: text
                            });

                            await result;

                            expect(subject3.jwtHandler).toHaveBeenCalledWith(text);
                        });

                    });

                });

                describe("postForm", () => {

                    describe("should make POST request to url", () => {
                        let data = new URLSearchParams("a=b");
                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = subject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async () => {
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'POST',
                                data: data,
                                rawData: '',
                                headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();

                        })

                    });

                    describe("should make POST request to url with custom static headers", () => {
                        let data = new URLSearchParams("a=b");
                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = customStaticHeaderSubject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async () => {
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'POST',
                                data: data,
                                rawData: '',
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Custom-Header-1": "this-is-header-1",
                                    "Custom-Header-2": "this-is-header-2"
                                }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();

                        })

                    });

                    describe("should make POST request to url with custom dynamic headers", () => {
                        let data = new URLSearchParams("a=b");
                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = customDynamicHeaderSubject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async () => {
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'POST',
                                data: data,
                                rawData: '',
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Custom-Header-1": "my-name-is-header-1",
                                    "Custom-Header-2": "my-name-is-header-2"
                                }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();

                        })

                    });

                    describe("should set basicAuth as authorization header", () => {
                        let data = new URLSearchParams("payload=dummy");
                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = subject.postForm(url, data, 'basicAuth');
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async () => {
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'POST',
                                data: data,
                                rawData: '',
                                headers: {
                                    Accept: "application/json",
                                    Authorization: "Basic basicAuth",
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();

                        })

                    });

                    describe("should set payload as body", () => {
                        let data = new URLSearchParams("payload=dummy");
                        beforeEach(() => {
                            spyOn(Ext.Ajax, 'request').and.callThrough();
                            result = subject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async () => {
                            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                                url: url,
                                method: 'POST',
                                data: data,
                                rawData: '',
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            });

                            request.respondWith(rejectResponse);
                            await expectAsync(result).toBeRejected();

                        })

                    });

                    describe("should fulfill promise when http response is 200", () => {
                        let data = new URLSearchParams("payload=dummy");
                        let json = { foo: 1, bar: "test" };
                        beforeEach(() => {
                            result = subject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it("测试", async () => {
                            request.respondWith({
                                status: 200,
                                responseHeaders:{
                                    Accept: "application/json",
                                    "Content-Type": "application/json"                
                                },
                                responseText: JSON.stringify(json)
                            });
                            await expectAsync(result).toBeResolvedTo(json);

                        })

                    });

                    describe("should reject promise when http response is 200 and json is not able to parse", () => {
                        let error = new SyntaxError("Unexpected token a in JSON");
                        let data = new URLSearchParams("payload=dummy");

                        beforeEach(() => {
                            result = subject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 200,
                                responseText: error
                            });

                            await expectAsync(result).toBeRejectedWith(new Error(error));
                        });

                    });

                    describe("should reject promise when http response is 200 and content type is not json", () => {
                        let data = new URLSearchParams("payload=dummy");
                        let json ={ foo: 1, bar: "test" };

                        beforeEach(() => {
                            result = subject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 200,
                                contentType: 'text/html',
                                responseText: JSON.stringify(json)
                            });

                            await expectAsync(result).toBeRejectedWith(new Error(`Invalid response Content-Type: text/html, from URL: ${url}`));
                        });

                    });

                    describe("should reject promise when http response is 400 and json has error field", () => {
                        let data = new URLSearchParams("payload=dummy");
                        let json ={ error: 'error' };

                        beforeEach(() => {
                            result = subject.postForm(url, data);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 400,
                                responseHeaders: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"                
                                },
                                statusText: 'Bad Request',
                                responseText: JSON.stringify(json)
                            });

                            await expectAsync(result).toBeRejectedWith(new Error(`Bad Request (400)`));
                        });

                    });

                    describe("should accept custom content type in response", () => {
                        let json = { foo: 1, bar: "test" };
                        let subject2;

                        beforeEach(() => {
                            subject2 = Ext.create('oidc.service.json', ["foo/bar"] );
                            result = subject2.getJson(url);
                            request = jasmine.Ajax.requests.mostRecent();
                        })

                        it('测试', async () => {
                            request.respondWith({
                                status: 200,
                                contentType: "foo/bar",
                                responseText: JSON.stringify(json)
                            });

                            await expectAsync(result).toBeResolvedTo(json);
                        });

                    });


                });

                describe("测试规范化返回结果", () => {
                    let json =  {
                        "access_token": "SlAV32hkKG",
                        "token_type": "Bearer",
                        "refresh_token": "8xLOxBtZp8",
                        "expires_in": 3600,
                        "id_token": `id_token`
                       };

                    beforeEach(() => {
                        result = subject.getJson(url);
                        request = jasmine.Ajax.requests.mostRecent();
                    })

                    it('测试', async () => {
                        request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(json)
                        });

                        await expectAsync(result).toBeResolvedTo({
                            "accessToken": "SlAV32hkKG",
                            "tokenType": "Bearer",
                            "refreshToken": "8xLOxBtZp8",
                            "expiresIn": 3600,
                            "idToken": `id_token`
    
                        });
                    });
                });

            });

        }
    }


});
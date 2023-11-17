Ext.define('Test.spec.common.core.service.HttpClient', {

    requires: [
        'Common.core.service.Url',
        'Common.core.service.HttpClient'
    ],

    statics: {


        run() {
            describe('Common.core.service.HttpClient', () => {
                let url = URI.get('test'),
                    request,
                    response;



                beforeEach(() => {
                    jasmine.Ajax.install();
                });

                afterEach(() => {
                    jasmine.Ajax.uninstall();
                })

                describe("测试返回结果的getJson方法", () => {
                    let jsonTestData = { test: 'test' };
                    beforeEach(() => {
                        response = Http.get(url);
                        spyOn(Http, 'get').and.callThrough();
                        request = jasmine.Ajax.requests.mostRecent();
                        expect(request.url).toContain(url);
                        expect(request.method).toBe('GET');

                    })

                    it('验证返回数据', () => {
                        request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(jsonTestData)
                        });
                        expect(response.getJson().test).toEqual(jsonTestData.test);
                    })
                });

                describe("测试异步串联返回结果", () => {
                    let jsonTestData = { test: 'test' };
                    beforeEach(() => {
                        response = Http.get(url).then((response)=>{
                            expect(response.getJson().test).toEqual(jsonTestData.test);
                        });
                        spyOn(Http, 'get').and.callThrough();
                        request = jasmine.Ajax.requests.mostRecent();
                        expect(request.url).toContain(url);
                        expect(request.method).toBe('GET');

                    })

                    it('验证返回数据', () => {
                        request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(jsonTestData)
                        });
                    })
                });


                describe('测试返回结果的getError方法', () => {
                    let postData = { name: 'test' },
                        errorTestData = {
                            error: {
                                code: null,
                                message: "错误",
                                details: null,
                                validationErrors: [
                                    {
                                        "message": "验证错误",
                                        "members": [
                                            "name", "displayName"
                                        ]
                                    }
                                ]
                            }
                        };

                    beforeEach(() => {
                        response = Http.post(url, postData);
                        spyOn(Http, 'post').and.callThrough();
                        request = jasmine.Ajax.requests.mostRecent();
                        expect(request.url).toContain(url);
                        expect(request.method).toBe('POST');

                    })

                    it('验证返回数据', () => {
                        request.respondWith({
                            status: 400,
                            contentType: 'application/json',
                            responseText: JSON.stringify(errorTestData)
                        });
                        let error = response.getError();
                        expect(response.result.status).toEqual(HttpStatusCode.Status400);
                        expect(error.message).toEqual(errorTestData.error.message);
                        expect(error.validationErrors.name).toContain(errorTestData.error.validationErrors[0].message);
                        expect(error.validationErrors.displayName).toContain(errorTestData.error.validationErrors[0].message);
                    })

                })


            })
        }
    }

})

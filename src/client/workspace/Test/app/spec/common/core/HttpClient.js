Ext.define('Test.spec.common.core.HttpClient', {
    singleton: true,

    requires: [
        'Common.core.service.Url',
        'Common.core.service.HttpClient'
    ],

    constructor() {
        describe('Common.core.service.HttpClient', () => {

            let url = URI.get('test');

            var testObj = {
                ajaxFunction: function (url) {
                    Http.get(url).then(this.successFunction.bind(this))
                },
                successFunction: function (data) {
                    console.log(data);
                    return data.responseText;
                }
            }

            beforeEach(function () {
                jasmine.Ajax.install();

            });

            afterEach(function () {
                jasmine.Ajax.uninstall();
            })

            it('sample test', function () {
                spyOn(Http, 'successFunction').and.callThrough();
                testObj.ajaxFunction(url);
                let temp = jasmine.Ajax.requests.mostRecent();
                expect(temp.url).toContain(url);
                expect(testObj.successFunction).not.toHaveBeenCalled();
                temp.respondWith({
                    "status": 200,
                    "contentType": 'text/plain',
                    "responseText": 'awesome response'
                });
                expect(testObj.successFunction).toHaveBeenCalledWith('awesome response');
            });
        })
    }
})

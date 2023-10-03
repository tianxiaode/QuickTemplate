Ext.define('Test.spec.common.core.HttpClient', {

    constructor() {
        describe('Common.core.service.HttpClient', () => {

            let onSuccess, onFailure,
                url = URI.get('test');


            beforeEach(function () {
                jasmine.Ajax.install();

                onSuccess = jasmine.createSpy('onSuccess');
                onFailure = jasmine.createSpy('onFailure');

                jasmine.Ajax.stubRequest(url).andReturn({
                    "responseText": 'immediate response'
                });

                Http.get(url).then((response)=>{
                    onSuccess(response.jsonData);
                }, onFailure);

                request = jasmine.Ajax.requests.mostRecent();

                console.log(request);
                //expect(request.url).toBe('https://localhost:44320/api/test');
                expect(request.method).toBe('GET');
                 console.log(request.data())
                //expect(request.data()).toEqual({ latLng: ['40.019461, -105.273296'] });
            });

            afterEach(function() {
                jasmine.Ajax.uninstall();
            });

            describe("on success", function () {
                console.log('1', arguments)
                it("calls onSuccess with an array of Locations", function () {
                    expect(onSuccess).toHaveBeenCalled();

                    console.log('ddddd', arguments)
                    // var successArgs = onSuccess.calls.mostRecent().args[0];

                    // expect(successArgs.length).toEqual(1);
                    // expect(successArgs[0]).toEqual(jasmine.any(Venue));
                });
            });
        });
    }
})

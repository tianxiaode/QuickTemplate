Ext.define('Test.spec.common.core.Url', {
    singleton: true,

    requires:[
        'Common.core.service.Url'
    ],

    constructor() {
        describe('Common.core.service.Url', () => {
            let url,
                apiUrl = AppConfig.apiUrl;


            it('should be able to get the URL with the default path', function () {
                url = URI.get('test');
                expect(url).toEqual(`${apiUrl}api/test`);

            });

            it('should be able to get multipath URLs with default paths', function () {
                url = URI.get('test', 'test');
                expect(url).toEqual(`${apiUrl}api/test/test`);

            });

            it('should be able to get the URL without the default path', function () {
                url = URI.get(false, 'test', 'test');
                expect(url).toEqual(`${apiUrl}test/test`);

            });
        });

    }
})

Ext.define('Test.spec.common.core.service.Url', {
    singleton: true,

    requires:[
        'Common.core.service.Url'
    ],

    constructor() {
        describe('Common.core.service.Url', () => {
            let url,
                apiUrl = AppConfig.apiUrl;


            it('获取带默认路径的单一路径的访问地址', function () {
                url = URI.get('test');
                expect(url).toEqual(`${apiUrl}api/test`);

            });

            it('获取带默认路径的多个路径的访问地址', function () {
                url = URI.get('test', 'test');
                expect(url).toEqual(`${apiUrl}api/test/test`);

            });

            it('获取不带默认路径的多个路径的访问地址', function () {
                url = URI.get(false, 'test', 'test');
                expect(url).toEqual(`${apiUrl}test/test`);

            });
        });

    }
})

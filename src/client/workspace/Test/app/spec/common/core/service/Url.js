Ext.define('Test.spec.common.core.service.Url', {

    requires: [
        'Common.core.service.Url'
    ],

    statics: {

        run() {
            describe('Common.core.service.Url', () => {
                let url,
                    server = AppConfig.server;


                it('测试单一参数', () => {
                    url = URI.get('test');
                    expect(url).toEqual(`${server}api/test`);

                });

                it('测试多个参数', () => {
                    url = URI.get('test', 'test');
                    expect(url).toEqual(`${server}api/test/test`);

                });

                it('测试第一个参数为数组', () => {
                    url = URI.get(['1', '2']);
                    expect(url).toEqual(`${server}api/1/2`);

                });

                it('测试第一个参数为数组且有第二个参数', () => {
                    url = URI.get(['1', '2'], '3');
                    expect(url).toEqual(`${server}api/1/2/3`);

                });

                it('测试自动分割驼峰命名', () => {
                    url = URI.get('applicationConfiguration');
                    expect(url).toEqual(`${server}api/application-configuration`);

                });


                it('测试一个参数且不带默认路径', () => {
                    url = URI.get(false, 'test');
                    expect(url).toEqual(`${server}test`);

                });

                it('测试两个参数且不带默认路径', () => {
                    url = URI.get(false, 'test', 'test');
                    expect(url).toEqual(`${server}test/test`);
                });



            });

        }
    }
})

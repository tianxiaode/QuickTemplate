Ext.define('Test.spec.common.core.util.HttpStatusCode', {
    singleton: true,

    requires:[
        'Common.core.util.HttpStatusCode'
    ],

    constructor() {
        describe('Common.core.service.HttpStatusCode', () => {

            it('获取200的状态信息', function () {
                let code = HttpStatusCode.getMessage(HttpStatusCode.Code200);
                expect(code).toEqual('Ok');

            });

        });

    }
})

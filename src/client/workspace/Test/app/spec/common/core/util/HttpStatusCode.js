Ext.define('Test.spec.common.core.util.HttpStatusCode', {
    singleton: true,

    requires:[
        'Common.core.util.HttpStatusCode'
    ],

    constructor() {
        describe('Common.core.util.HttpStatusCode', () => {

            it('获取200的状态信息', () => {
                let code = HttpStatusCode.getMessage(HttpStatusCode.Status200);
                expect(code).toEqual('Ok');

            });

        });

    }
})

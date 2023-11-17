Ext.define('Test.spec.common.core.util.HttpStatusCode', {

    requires: [
        'Common.core.util.HttpStatusCode'
    ],

    statics: {
        run() {
            describe('Common.core.util.HttpStatusCode', () => {

                it('获取200的状态信息', () => {
                    let code = HttpStatusCode.getMessage(HttpStatusCode.Status200);
                    expect(code).toEqual('Ok');

                });

            });

        }
    }
})

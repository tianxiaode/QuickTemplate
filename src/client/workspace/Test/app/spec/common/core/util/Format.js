Ext.define('Test.spec.common.core.util.Foramt', {

    requires: [
        'Common.core.util.Format'
    ],


    statics: {


        run() {
            describe('Common.core.util.Foramt', () => {

                it('自动分割驼峰命名', () => {
                    expect(Format.splitCamelCase('applicationConfiguration')).toEqual('application-configuration');
                });

                it('使用自定义替换字符串', () => {
                    expect(Format.splitCamelCase('applicationConfiguration', '_')).toEqual('application_configuration');
                });

            });

        }
    }
});
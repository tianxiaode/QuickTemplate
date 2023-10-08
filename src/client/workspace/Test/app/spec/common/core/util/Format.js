Ext.define('Test.spec.common.core.util.Foramt', {
    singleton: true,

    requires:[
        'Common.core.util.Format'
    ],
    
    constructor(){
        describe('Common.core.util.Foramt', () => {

            it('自动分割驼峰命名', () => {
                expect(Format.splitCamelCase('applicationConfiguration')).toEqual('application-configuration');
            });

        });

    }
});
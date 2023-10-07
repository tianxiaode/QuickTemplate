Ext.define('Test.spec.common.core.util.Md5', {
    singleton: true,
    
    constructor(){
        describe('Common.core.util.Md5', () => {

            it('验证MD5值', () => {
                let value = MD5.get('abcd');
                expect(value).toEqual('e2fc714c4727ee9395f324cd2e7f331f');

            });

        });

    }
});
Ext.define('Test.spec.common.core.util.crypto.Md5', {
    singleton: true,
    
    constructor(){
        describe('Common.core.util.crypto.Md5', () => {

            it('验证MD5值', () => {
                let value = MD5.get('abcd');
                expect(value).toEqual('e2fc714c4727ee9395f324cd2e7f331f');

            });

            it('验证MD5返回大写字母值值', () => {
                let value = MD5.get('abcd', true);
                expect(value).toEqual('E2FC714C4727EE9395F324CD2E7F331F');

            });

        });

    }
});
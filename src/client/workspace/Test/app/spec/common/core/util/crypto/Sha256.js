Ext.define('Test.spec.common.core.util.crypto.Sha256', {

    requires: [
        'Common.core.util.crypto.Sha256'
    ],

    statics: {

        run() {
            describe('Common.core.util.crypto.Sha256', () => {
                let value;

                it('验证SHA256', () => {
                    value = SHA256.get('abc');
                    expect(value).toEqual('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

                });

                it('验证SHA256返回大写字母值', () => {
                    value = SHA256.get('abc', true);
                    expect(value).toEqual('BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD');

                });

            });

        }
    }
});

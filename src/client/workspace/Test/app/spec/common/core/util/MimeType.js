Ext.define('Test.spec.common.core.util.MimeType', {

    requires: [
        'Common.core.util.MimeType'
    ],

    statics: {

        run() {
            describe('Common.core.util.MimeType', () => {

                it('根据扩展名获取MimeType', function () {
                    let mimeType = Ext.MimeType.getMimeType('jpg');
                    expect(mimeType).toEqual('image/jpeg');

                });

                it('根据文件名获取MimeType', function () {
                    let mimeType = Ext.MimeType.getMimeType('test.jpg');
                    expect(mimeType).toEqual('image/jpeg');

                });

                it('根据MimeType获取扩展名', function () {
                    let ext = Ext.MimeType.getSuffixes('image/jpeg');
                    expect(ext).toContain('jpg');

                });

            });

        }
    }
});
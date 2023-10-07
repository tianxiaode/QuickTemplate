Ext.define('Test.spec.common.core.util.MimeType', {
    singleton: true,
    
    requires:[
        'Common.core.util.MimeType'
    ],

    constructor() {
        describe('Common.core.util.MimeType', () => {

            it('根据扩展名获取MimeType', function () {
                let mimeType = MimeTypeExt.getMimeType('jpg');
                expect(mimeType).toEqual('image/jpeg');

            });

            it('根据文件名获取MimeType', function () {
                let mimeType = MimeTypeExt.getMimeType('test.jpg');
                expect(mimeType).toEqual('image/jpeg');

            });

            it('根据MimeType获取扩展名', function () {
                let ext = MimeTypeExt.getSuffixes('image/jpeg');
                expect(ext).toContain('jpg');

            });

        });

    }
});
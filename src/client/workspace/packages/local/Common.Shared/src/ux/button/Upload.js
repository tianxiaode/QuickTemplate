/**
 * 上传按钮
 */
Ext.define('Common.Shared.ux.button.Upload',{
    extend: 'Ext.Button',
    xtype: 'uploadbutton',

    mixins:[
        'Common.Shared.mixin.Plupload'
    ],

    iconCls: 'x-fa fa-upload',
    ui: 'action',
    tooltip: I18N.FileUpload,

    config:{
        filters: {
            max_file_size: '3mb',
            mime_types: [
                { title: I18N.Image, extensions: 'jpg,png,jpeg' }
            ]
        },
    },
   
    initialize(){
        let me = this;
        me.callParent();
        me.on({
            scope: this,
            painted: 'onPainted',
            single: true
        });

    },

    onPainted(){
        let me = this;
            // config = {
            //     browse_button: me.element.getId(),
            //     max_file_size: me.getMaxFileSize(),
            //     autoStart :me.getAutoStart(),
            //     multiSelection: me.getMultiSelection(),
            //     url : me.getUrl(),
            //     filters: me.getFilters(),
            //     multipart: me.getMultipart(),
            //     multiPartParams: me.getMultiPartParams(),
            //     file_data_name: me.getFileDataName(),
            // };
        me.initUploader();
        
    },

    destroy: function() {
        var me = this,
            uploader = me.uploader;

        if(uploader){
            uploader.destroy();
        }

        delete me.uploader;

        me.callParent();
    },

})
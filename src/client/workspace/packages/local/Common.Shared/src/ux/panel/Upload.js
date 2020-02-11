/**
 * 上传面板
 */
Ext.define('Common.Shared.ux.panel.Upload',{
    extend: 'Ext.Component',
    xtype: 'uploadpanel',

    mixins:[
        'Common.Shared.mixin.Plupload'
    ],


    config:{
        value:0,
        text: '',
        filters: {
            max_file_size: '3mb',
            mime_types: [
                { title: I18N.Image, extensions: 'jpg,png,jpeg' }
            ]
        },
        useAjax: false
    },


    baseCls: Ext.baseCSSPrefix + 'uploadpanel',
    classCls: Ext.baseCSSPrefix + 'panel',

    getTemplate: function() {
        return [{
            reference: 'innerElement',
            cls: Ext.baseCSSPrefix + 'inner-el',
            children: [{
                reference: 'bodyElement',
                cls: Ext.baseCSSPrefix + 'body-el',
                children:[
                    {
                        reference: 'textElement',
                        cls: Ext.baseCSSPrefix + 'text-el',
                        //html:I18N.DragFileAndClick
                    },
                    {
                        reference: 'imageElement',
                        tag:'img',
                        cls: Ext.baseCSSPrefix + 'image-el',
                        hidden: true
                    },
                    {
                        reference: 'progressElement',
                        cls: Ext.baseCSSPrefix + 'progress',
                        hidden: true,
                        children:[
                            {
                                reference: 'barEl',
                                cls: Ext.baseCSSPrefix + 'progress-bar',
                                children: [{
                                    reference: 'textEl',
                                    textCls: Ext.baseCSSPrefix + 'progress-text',
                                }]
                            }                
                        ]
                    },
                    {
                        reference: 'loadingElement',
                        cls: Ext.baseCSSPrefix + 'loading-el',
                        hidden: true,
                    }
                ]
            }]
        }]
    },

    applyValue: function(value) {
        return value || 0;
    },

    updateValue: function(value, oldValue) {
        let text = value + '%';
        this.barEl.setStyle('width', text);
        this.textEl.setHtml(text);
    },

    updateText: function(text) {
        let me = this,
            html = `<p>${text}</p><p>${I18N.DragFileAndClick}</p>`;
        me.textElement.setHtml(html);
        me.el.set({
            title: text
        });
        return text;
    },


    initialize(){
        let me = this;
        me.callParent();
        me.imageElement.on('load', me.onImageLoad ,me);
        me.imageElement.on('error', me.onImageError ,me);
        me.on({
            scope: this,
            painted: 'onPainted',
            single: true
        });
        me.on('resize', me.onPanelResize, me);

    },

    onPanelResize(){
        let me = this,
            el = Ext.fly(me.el);
            width = el.getWidth() -20,
            height = el.getHeight() -20;
        me.textElement.setWidth(width-40);
        me.textElement.setTop((height-24)/2);
        me.progressElement.setWidth(width-40);
        me.progressElement.setTop((height-20)/2);
        me.adjustImageSize();
    },

    onPainted(){
        let me = this,
            el = Ext.fly(me.el);
            width = el.getWidth() -20,
            height = el.getHeight() -20;
        me.initUploader();
        if(me.imageElement.dom.complete){
            me.onImageLoad(null,me.imageElement.dom)
        }
        me.on({
            beforeupload: me.onBeforeUpload,
            fileuploaded: me.onFileUploaded,
            uploadprogress: me.onProgress,
            uploaderror: me.onUploadError,
            scope: me
        });
        
    },

    onProgress(sender, file, name, size, percent){
        let me = this;
        me.setValue(percent);
    },

    onFileUploaded(sender,file, result){
        this.progressElement.hide(false);
        this.updateImage(result.result.url || result.result);
        //Ext.defer(this.updateImage,500, this, [result.result]);
    },

    onBeforeUpload(sender,file){
        let me = this;
        me.setValue(0);
        me.textElement.hide(false);        
        me.progressElement.show(false);
    },

    onUploadError(sender,error, errorMessage){
        let me = this;
        me.progressElement.hide(true);
        me.textElement.hide(true);
        me.onImageError();
    },

    updateImage(url){
        let me = this,
            useAjax = me.getUseAjax();
        me.imageElement.hide(true);
        me.progressElement.hide(true);
        me.loadingElement.hide(false);
        if(Ext.isEmpty(url)){
            me.textElement.hide(false);
            return;
        } 
        url = (url.includes('http') ? '' : ROOTPATH) + url;
        if(!useAjax){
            me.textElement.hide(false);
            me.imageElement.set({
                src: url
            });
            return;    
        }
        me.ajaxGet(url);
    },

    ajaxGet(url){
        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url : url,
            binary: true,
            success: function(response, options){
                var me = this,
                    bytes = response.responseBytes,
                    blob = new Blob([bytes], {type:'image/jpeg'});
                me.imageBlob = blob;
                if(Ext.isEmpty(blob)){
                    me.clearImage();
                    return;
                }
                me.imageElement.set({
                    src: URL.createObjectURL(me.imageBlob)
                })
            },
            failure: function(){
                me.clearImage();
                // me.imageElement.set({
                //     src: 'resources/shared/images/404.png'
                // })
            },
            scope:me
        })
    },

    adjustImageSize(){
        let me = this,
            el = me.imageElement,
            image = el.dom,
            cWidth = me.bodyElement.getWidth(),
            cHeight = me.bodyElement.getHeight(),
            imgWidth = image.naturalWidth,
            imgHeight = image.naturalHeight,
            width = cWidth>cHeight ? imgWidth*(cHeight)/imgHeight : cWidth,
            height = cWidth>cHeight ? cHeight : cWidth*imgHeight/imgWidth;
        if(cWidth>cHeight && width>cWidth){
            width = cWidth;
            height = cWidth*imgHeight/imgWidth;
        }else if(cHeight>cWidth && height>cHeight){
            height = cHeight;
            width = height * imgWidth/imgHeight;
        }
        el.setWidth(width);
        el.setHeight(height);
        el.setLeft((cWidth-width)/2);
        el.setTop((cHeight-height)/2);
    },

    onImageLoad(sender, image){
        let me = this;
        me.adjustImageSize();
        me.loadingElement.hide(true);
        me.imageElement.show();
    },

    onImageError(){
        this.imageElement.set({
            src: 'resources/images/404.png',
        });
        
    },

    clearImage(){
        let me = this;
        me.textElement.show(false);
        me.imageElement.hide(false);
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
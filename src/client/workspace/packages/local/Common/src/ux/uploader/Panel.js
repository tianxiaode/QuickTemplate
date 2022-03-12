Ext.define('Common.ux.uploader.Panel',{
    extend: 'Ext.Component',
    xtype: 'uxuploadpanel',

    mixins:[
        'Common.ux.uploader.Uploader',
    ],

    classCls: Ext.baseCSSPrefix + 'upload-panel',

    resourceName: 'FileManagement',

    config:{
        text: 'Browse',
        multiple: false,
        panelStatus: null,
        fileStatusText: null,
        source: null,
        fileResult: null,
        imageWidth: 0,
        imageHeight: 0,
        previewWidth: 0,
        previewHeight: 0,
        relateField: 'image',
        relateFieldContainer: 'formpanel',
        fileInfoTpl:`
            <div class="row  px-2 py-1">                
                <div class="col-auto pl-0 m-0 text-dark" style="min-width:80px;" >{filename:localized("Filename")}</div>
                <div class="col pr-0 pl-0 m-0 black-54 text-truncate " >: {filename}</div>
            </div>
            <div class="row  px-2 py-1">                
                <div class="col-auto pl-0 m-0 text-dark"  style="min-width:80px" >{size:localized("FileSize")}</div>
                <div class="col pr-0 pl-0 m-0 black-54 text-truncate" >: {size:fileSize}</div>
            </div>
        `
    },

    STATUS:{
        EMPTY: 'empty',
        UPLOADING: 'uploading',
        SUCCESS: 'success', 
        ERROR: 'error', 
        ABORTED: 'aborted',
        LOADING: 'loading',
        LOADED: 'loaded',
        READY: 'ready'
    },

    getTemplate() {
        return [
            {
                cls: 'info-bar',
                children:[
                    {
                        reference: 'infoElement',
                        cls: 'message'
                    },
                    {
                        cls: 'tool-bar',
                        children:[
                            {
                                reference: 'deleteElement',
                                cls: 'tool',
                                children:[
                                    {
                                        cls: 'x-far fa-times-circle text-danger',
                                    }
                                ]
                            },
                            {
                                reference: 'abortElement',
                                cls: 'tool',
                                children:[
                                    {
                                        cls: 'x-far fa-pause-circle text-danger',
                                    }
                                ]
                            },
                            {
                                reference: 'resumeElement',
                                cls: 'tool',
                                children:[
                                    {
                                        cls: 'x-far fa-play-circle text-success',
                                    }
                                ]
                            },                
                        ]
                    }
                ]

            },
            {
                cls: 'preview-wrap',
                reference: 'previewElement',
                children:[
                    {
                        reference: 'browseElement',
                        cls: 'browse'
                    },
                ]
            },
            {
                cls: 'file-info',
                children:[
                    {
                        reference: 'fileInfoElement',
                    },
                    {
                        reference: 'progressElement',
                        cls: 'progress',
                        margin: '0 0 0 10px',
                        children:[
                            {
                                //style: 'width:25%',
                                reference: 'progressBar',
                                cls: 'progress-bar',
                                //html: '25%'
                            }
                        ]        
                    },
        
                ]
            },
            {
                reference: 'inputElement',
                tag: 'input',
                type: 'file',
            },
        ];

    },
    
    initialize(){
        let me = this;
        me.setPanelStatus(me.STATUS.EMPTY);
        me.callParent();
        me.previewElement.on('tap', me.onBrowseElementTap, me);
        me.resumeElement.on('tap', me.onResumeTap, me);
        me.deleteElement.on('tap', me.onDelete , me);
        me.abortElement.on('tap', me.onAborted , me);

        me.on('fileadded', me.onFileAdd, me);
        me.on('computehash', me.onComputeHash, me);
        me.on('checkfile', me.onCheckFile, me);
        me.on('checkfilesuccess', me.onCheckFileSuccess, me);
        me.on('checkfileerror', me.onCheckFileError, me);
        me.on('checkfileerror', me.onCheckFileError, me);
        me.on('filestart', me.onFileStart, me);
        me.on('fileready', me.onFileReady, me);
        me.on('chunkuploaded', me.onChunkUploaded, me);
        me.on('chunkerror', me.onChunkError, me);
        me.on('fileprogress', me.onFileProgress, me);
        me.on('filesuccess', me.onFileSuccess, me);
        me.on('filefailure', me.onFileFailure, me);
        //me.inputElement.on('change', me.onSelectFiles, me);
        // me.deleteElement.on('tap', me.onDelete , me);
         //me.on('resize', me.onPanelSize, me);
        //me.setFileState(me.stateEnum.EMPTY);
        //me.bodyElement.on('drop', me.onSelectFiles, me);
        //me.updateElementState();
    },

    onSelectFiles(e, target){},

    applyFileInfoTpl(tpl){
        return Template.getTpl.call(this, tpl);
    },

    updateText(text){
        this.browseElement.update(I18N.get(text));
    },

    updateFileStatusText(text){
        let me = this;
        me.infoElement.update(text);
        me.infoElement.set({'title': text});
    },

    applySource(source){
        let me = this;
        me.setEmpty();
        if(Ext.isEmpty(source)) return source;
        let url = URI.crud('file', source);
        Http.get(url, null, null, null, true)
            .then(me.onSourceLoad, me.onSourceLoadFailure, null, me);
        return source;
    },

    updatePanelStatus(status){
        let me = this,
            STATUS = me.STATUS;
        if(!status) return;

        if(status === STATUS.LOADING){
            me.setFileStatusText(I18N.get('LoadingText'));
        }else if(status === STATUS.LOADED){
            me.setFileStatusText(I18N.get(''));
        }

        me.deleteElement.setDisplayed(
            status === STATUS.SUCCESS || 
            status === STATUS.ABORTED ||
            status === STATUS.LOADED ||
            status === STATUS.READY
            );
        me.abortElement.setDisplayed(status === STATUS.UPLOADING);              
        me.resumeElement.setDisplayed(status === STATUS.ABORTED || status === STATUS.READY);
        me.progressElement.setDisplayed(status === STATUS.UPLOADING);
        me.browseElement.setDisplayed(status === STATUS.EMPTY);
        //me.imageElement.setDisplayed(status !== STATUS.EMPTY);
        me.fileInfoElement.setDisplayed(status !== STATUS.EMPTY);

    },

    setImageTitle(filename, size){
        this.previewElement.set({ 
            title:  `${I18N.get('Filename')}: ${filename}\r\n${I18N.get('FileSize')}: ${Format.fileSize(size)}`
        });
    },

    updateFileResult(result){
        let me = this;
        me.fileInfoElement.update(me.getFileInfoTpl().apply(result));
        me.setImageTitle(result.filename,result.size);
    },

    onBrowseElementTap(){
        let me = this;
        if(me.getPanelStatus() === me.STATUS.UPLOADING) return;
        me.inputElement.dom.click();        
    },

    onResumeTap(){
        let me = this;
        me.setPanelStatus(me.STATUS.UPLOADING);
        me.resume();
    },

    onAborted(){
        let me = this;
        me.setPanelStatus(me.STATUS.ABORTED);
        me.aborted();
    },


    onDelete(){
        let me = this,
            source = me.getSource();
        // 远程删除
        me.setEmpty();
        //me.remove();
        if(Ext.isEmpty(source)) return;
        // Http.delete(URI.crud('File'),{
        //     id: form.getRecord().getId(),
        //     storageType: me.getStorageType(),
        //     filename: source
        // });
    },

    setEmpty(){
        let me = this;
        me.fileInfoElement.update('');
        me.infoElement.update('');
        me.setPanelStatus(me.STATUS.EMPTY);
        me.previewElement.dom.style.backgroundImage = 'url("' + Ext.BLANK_IMAGE_URL + '")';
        me.inputElement.dom.value = null;
    },

    onFileAdd(me, file){
        let tpl = me.getFileInfoTpl();
            el = me.fileInfoElement;        
        el.update(tpl.apply(file));
        me.setPanelStatus(me.STATUS.LOADING);
    },

    onComputeHash(me, file){
        me.setFileStatusText(Format.format(I18N.get('ComputeHash'), file.filename));
    },

    onCheckFile(me, file){
        me.setFileStatusText(Format.format(I18N.get('CheckFile'), file.filename));
    },

    onCheckFileSuccess(me, file, result){
        let uploadedCount = file.chunkUploadCount;
        me.setFileStatusText(Format.format(I18N.get('CheckFileSuccess'), file.filename, uploadedCount, file.chunks.length - uploadedCount));
        me.onShowPreview(file, result);
    },

    onCheckFileError(me, file, error){
        me.setFileStatusText(Format.format(I18N.get('CheckFileError'), file.filename, error));
    },

    onFileStart(me, file){
        me.setPanelStatus(me.STATUS.UPLOADING);
        me.setFileStatusText(Format.format(I18N.get('FileStart'), file.filename));
        let percent = Format.percent(file.uploadedSize / file.size);
        me.progressBar.setStyle({ width: percent });
        me.progressBar.update(percent);
    },

    onFileReady(me, file){
        if(me.getPanelStatus() === me.STATUS.LOADING){
            Ext.defer(me.onFileReady, 50, me, [me, file]);
            return;
        }
        me.setPanelStatus(me.STATUS.READY);
        me.setFileStatusText(Format.format(I18N.get('FileReady'), file.filename));
    },

    onChunkUploaded(me, file, chunk){
        me.setFileStatusText(Format.format(I18N.get('ChunkUploaded'), file.filename, chunk.offset));
    },

    onChunkError(me, file, chunk, error){
        me.setFileStatusText(Format.format(I18N.get('ChunkError'), file.filename, chunk.offset, error));
    },

    onFileProgress(me, file, percent){
        percent = Format.percent(percent);
        me.progressBar.setStyle({ width: percent });
        me.progressBar.update(percent);
    },

    onFileSuccess(me, file, result){
        me.setFileStatusText(Format.format(I18N.get('FileSuccess'), result.filename));
        me.setSource(result.hash);
        me.setFileResult(result);
        me.setPanelStatus(me.STATUS.SUCCESS);
        me.setRelateFieldValue(result.hash);
    },

    onFileFailure(me, file, error){
        me.setFileStatusText(Format.format(I18N.get('FileFailure'), file.filename,error));
        me.setSource(null);
        me.setPanelStatus(me.STATUS.ERROR);
    },

    // onPanelSize(me){
    //     let previewElement = me.previewElement,
    //         imageElement = me.imageElement;
    //         img = imageElement.first('img');
    //     if(!img) return;
    //     me.setPreviewWidth(previewElement.getWidth(true));
    //     me.setPreviewHeight(previewElement.getHeight(true));
    //     me.resetImageSize();    
    // },

    onShowPreview(file,result){
        let me = this;
        if(file.status === UploaderStatus.MERGE) return;
        reader = new FileReader();
        reader.onload = Ext.bind(me.onFileLoadOnLocal, me);
        reader.readAsDataURL(file.file);  
    },

    onFileLoadOnLocal(e){
        this.setImage(e.target.result);
    },

    setImage(dataUrl){
        let me = this,
            imageElement = me.previewElement;
        imageElement.dom.style.backgroundImage = 'url("' + dataUrl + '")';
        if(me.getPanelStatus() === me.STATUS.LOADING)
        {
            me.setPanelStatus(me.STATUS.LOADED);            
        }
    },

    resetImageSize(){
        let me = this,
            imageElement = me.imageElement,
            previewElement = me.previewElement,
            cWidth = me.getPreviewWidth(),
            cHeight = me.getPreviewHeight(),
            iWidth = me.getImageWidth(),
            iHeight = me.getImageHeight();
        if(cWidth === 0) cWidth = previewElement.getWidth(true);
        if(cHeight == 0) cHeight = previewElement.getHeight(true);
        let width = cWidth > cHeight ? iWidth*cHeight/iHeight : cWidth,
            height = cWidth > cHeight ? cHeight : cWidth*iHeight/iWidth;
        if(cWidth>cHeight && height>cHeight){
            height = cHeight;
            width = cHeight*iWidth/iHeight;
        }else if(cHeight>cWidth && width>cWidth){
            width = cWidth;
            height = cWidth * iHeight/ iWidth;
        }
        imageElement.setSize(width, height);
    },

    privates:{
        onSourceLoad(response){
            let me = this,
                headers = response.getAllResponseHeaders(),
                mimeType = headers && headers['content-type'] || Fomart.mimeType.jpg,
                blob = Http.getBlobData(response, mimeType);
            if(blob) {
                me.setPanelStatus(me.STATUS.LOADING);
                me.setImage(URL.createObjectURL(blob));
                return;
            }
            me.setPanelStatus(me.STATUS.ERROR);
        },
    
        onSourceLoadFailure(response){
            let me = this,
                error = Failure.getError(response);
            me.setFileStatusText(`<span class="text-danger">${error}</span>`);
            me.setImage(URI.getResource('holder'));
            me.setPanelStatus(me.STATUS.ERROR);
        },
    
    },

    setRelateFieldValue(value){
        console.log(value);
        let me = this,
            fieldName = me.getRelateField();
        if(Ext.isEmpty(fieldName)) return;
        let field = me.up(me.getRelateFieldContainer()).down(`field[name=${fieldName}],field[searchName=${fieldName}]`);
        if(!field) return;
        console.log(value);
        field.setValue(value);
    }

});
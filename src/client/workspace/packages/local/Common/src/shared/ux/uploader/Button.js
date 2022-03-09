Ext.define('Common.shared.ux.uploader.Button',{
    extend: 'Ext.Button',
    xtype: 'uxuploadbutton',

    mixins:[
        'Common.shared.ux.uploader.Uploader',
    ],

    config:{
        relateField: null,
        relateFieldContainer: 'container',
    },

    iconCls: 'x-fa fa-upload',
    ui: 'success',
    buttonType: 'file',
    preventDefaultAction: false,
    keyHandlersAdded: true,
    multiple:false,
    progressBarContainer: null,

    getButtonTemplate() {
        var template = this.callParent();
 
        template.tag = 'input';
        template.listeners = template.listeners || {};
 
        return template;
    },

    initialize(){
        let me = this;
        me.callParent(arguments);

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

    },

    onSelectFiles(e,target){
        this.initProgressContainer();
    },

    onFileAdd(me, file){
        me.updateProgressInfo(file , file.filename, 0);
    },

    onComputeHash(me, file){
        me.updateProgressInfo(file, Format.format(I18N.get('ComputeHash'), file.filename));
    },

    onCheckFile(me, file){
        me.updateProgressInfo(file,Format.format(I18N.get('CheckFile'), file.filename));
    },

    onCheckFileSuccess(me, file, result){
        let uploadedCount = file.chunkUploadCount;
        me.updateProgressInfo(file,Format.format(I18N.get('CheckFileSuccess'), file.filename, uploadedCount, file.chunks.length - uploadedCount));
    },

    onCheckFileError(me, file, error){
        me.updateProgressInfo(file,Format.format(I18N.get('CheckFileError'), file.filename, error));
    },

    onFileStart(me, file){
        let percent = file.uploadedSize / file.size;
        me.updateProgressInfo(file,Format.format(I18N.get('FileStart'), file.filename), percent);
    },

    onFileReady(me, file){
    },

    onChunkUploaded(me, file, chunk){
        me.updateProgressInfo(file,Format.format(I18N.get('ChunkUploaded'), file.filename, chunk.offset));
    },

    onChunkError(me, file, chunk, error){
        me.updateProgressInfo(file,Format.format(I18N.get('ChunkError'), file.filename, chunk.offset, error));
    },

    onFileProgress(me, file, percent){
        me.updateProgressInfo(file,Format.percent(percent),percent);
    },

    onFileSuccess(me, file, result){
        me.updateProgressInfo(file,Format.format(I18N.get('FileSuccess'), file.filename), 1);
        me.setRelateFieldValue(result.filename);
    },

    onFileFailure(me, file, error){
        me.updateProgressInfo(file, Format.format(I18N.get('FileFailure'), file.filename,error));
    },

    getProgressContainer(){
        let me = this,
            container = me.progressContainer;
        if(!container){
            let filter = `#${me.progressBarContainer}`;
            container = me.progressContainer = 
                me.up().down(filter)
                || me.up().up().down(filter);
        }
        return container;
    },

    initProgressContainer(){
        let me = this,
            container = me.getProgressContainer();
        container.clearProgress();
        
    },

    updateProgressInfo(file,text, value){
        let me = this,
            container = me.getProgressContainer();
        container.updateProgress(file.filename, text, value);
    },

    setRelateFieldValue(value){
        let me = this,
            fieldName = me.getRelateField();
        if(Ext.isEmpty(fieldName)) return;
        let field = me.up(me.getRelateFieldContainer()).down(`#${fieldName},field[name=${fieldName}],field[searchName=${fieldName}]`);
        if(!field) return;
        field.setValue(value);
    }


});

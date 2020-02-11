/**
 * Plupload上传组件的功能混入类
 */
Ext.define('Common.Shared.mixin.Plupload',{
    mixinId: 'plupload',

    uploadEvents:[
        'OptionChanged','Refresh','StateChanged', 'Browse', 
        'FileFiltered','QueueChanged','FilesAdded','FilesRemoved',
        'BeforeUpload','UploadFile','UploadProgress','BeforeChunkUpload',
        'ChunkUploaded','FileUploaded','UploadComplete','Destroy'
    ],
    uploadInitEvents:['Init','PostInit','Error'],
    

    config:{
        defaultUploaderConfig:{
            runtimes: 'html5',
            //unique_names: true,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            required_features: null
        },
        maxFileSize: '10mb',
        autoStart: false,
        multiSelection: true,
        filters:null,
        url : null,
        useDefaultHeader: true,
        fileDataName: 'file',
        multipart: true,
        multiPartParams: null,
        resize: null
    },

    getUploaderConfig(){
        let me = this,
            isButton = me.isButton,
            elId = isButton ? me.element.getId() : me.bodyElement.getId(),
            multiPartParams = me.getMultiPartParams() || {},
            uploaderConfig = {},
            config = {
                browse_button: elId,
                //drop_element: me.bodyElement.getId(),
                max_file_size: me.getMaxFileSize(),
                autoStart :me.getAutoStart(),
                multiSelection: me.getMultiSelection(),
                url : me.getUrl(),
                filters: me.getFilters(),
                file_data_name: me.getFileDataName(),
                multipart: me.getMultipart(),
                multipart_params: Ext.clone(multiPartParams),
                resize: Ext.clone(me.getResize())
            };
        if(!isButton){
            config['drop_element'] =  elId;
        }
        return Object.assign(uploaderConfig,me.getDefaultUploaderConfig(), config);
    },

    initUploader(){
        let me = this,
            uploaderConfig = me.getUploaderConfig(),
            uploader;
        uploader = me.uploader = Ext.create('plupload.Uploader', uploaderConfig);
        me.bindUploadEvents(uploader,me.uploadInitEvents);

        uploader.init();
        if(me.getUseDefaultHeader()){
            let headers = Object.assign({}, HEADERS.getHeaders());
            uploader.setOption('headers',headers);
        }

        me.bindUploadEvents(uploader,me.uploadEvents);
    },

    bindUploadEvents(uploader,events){
        for (const event of  events) {
            uploader.bind(event,Ext.bind(this['onUploader'+ event], this));
        }
    },

    onUploaderInit(uploader){
        this.fireEvent('uploadready', this);
    },

    onUploaderPostInit(uploader){
        this.fireEvent('uploadpostinit', this);
    },
    
    onUploaderOptionChanged(uploader,name,value,oldValue){
        this.fireEvent('uploadoptionchanged', this, name,value,oldValue);
    },
    
    onUploaderRefresh(uploader){
        this.fireEvent('uploadrefresh', this);
    },
    
    onUploaderStateChanged(uploader){
        this.fireEvent('uploadstatechanged', this);
    },
    
    onUploaderBrowse(uploader){
        this.fireEvent('uploadbrowse', this);
    },

    onUploaderFileFiltered(uploader, file){
        return this.fireEvent('filefiltered', this,file);
    },

    onUploaderQueueChanged(uploader){
        this.fireEvent('queuechanged', this);
    },

    onUploaderFilesAdded(uploader, files){
        let me = this;
        if (me.fireEvent('filesadded', me, files) !== false) {
            if (me.getAutoStart() && uploader.state != 2)
                Ext.defer(function () {
                    me.uploader.start();
                }, 300);
        }
    },

    onUploaderFilesRemoved(uploader, files){
        this.fireEvent('filesremoved', this,files);
    },

    onUploaderBeforeUpload(uploader, file){
        return this.fireEvent('beforeupload', this, file);
    },
    
    onUploaderUploadFile(uploader,file){
        this.fireEvent('upload', this, file);
    },

    onUploaderUploadProgress(uploader,file){
        var me = this,
            name = file.name,
            size = file.size,
            percent = file.percent;

        me.fireEvent('uploadprogress', me, file, name, size, percent);

        if (file.server_error)
            file.status = 4;

    },
    
    onUploaderBeforeChunkUpload(uploader,file, args, blob, offset){
        this.fireEvent('beforechunkupload', this, file, args, blob, offset);
    },
    
    onUploaderChunkUploaded(uploader,file, result){
        this.fireEvent('chunkuploaded', this, file, result);
    },

    onUploaderFileUploaded(uploader,file, result){
        var me = this,
            response = Ext.JSON.decode(result.response);

        if (response.success == true) {
            file.server_error = 0;
            me.fireEvent('fileuploaded', me, file, response);
        }
        else {
            if (response.msg) {
                file.msg = response.msg;
            }
            file.server_error = 1;
            me.fireEvent('uploaderror', me, Ext.apply(status, {
                file: file
            }));
        }
    },
    
    onUploaderUploadComplete(uploader,files){
        this.fireEvent('uploadcomplete', this,files);
    },
    
    onUploaderError(uploader,error){
        let message = '',
            fm =Ext.util.Format,
            details = '';
        if(error.status === 500){
            let response = Ext.decode(error.response,true);
            message = response.error && response.error.message;
        }else{
			let L = plupload.translate;
			message = '<strong>' + error.message + '</strong>';
			switch (error.code) {
				case plupload.FILE_EXTENSION_ERROR:
					details = plupload.sprintf(L("File: %s"), error.file.name);
					break;
				
				case plupload.FILE_SIZE_ERROR:
					details = plupload.sprintf(L("File: %s, size: %s, max file size: %s"), error.file.name,  fm.fileSize(error.file.size),  fm.fileSize(plupload.parseSize(uploader.getOption('filters').max_file_size)));
					break;

				case plupload.FILE_DUPLICATE_ERROR:
					details = plupload.sprintf(L("%s already present in the queue."), error.file.name);
					break;
					
				case self.FILE_COUNT_ERROR:
					details = plupload.sprintf(L("Upload element accepts only %d file(s) at a time. Extra files were stripped."), up.getOption('filters').max_file_count || 0);
					break;
				
				case plupload.IMAGE_FORMAT_ERROR :
					details = L("Image format either wrong or not supported.");
					break;	
				
				case plupload.IMAGE_MEMORY_ERROR :
					details = L("Runtime ran out of available memory.");
					break;
				
				/* // This needs a review
				case plupload.IMAGE_DIMENSIONS_ERROR :
					details = plupload.sprintf(_('Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.'), up.runtime, up.features.maxWidth, up.features.maxHeight);
					break;	*/
											
				case plupload.HTTP_ERROR:
					details = L("Upload URL might be wrong or doesn't exist.");
					break;
			}

            message += I18N.LabelSeparator + " <i>" + details + "</i>";
            
			if (error.code === plupload.INIT_ERROR) {
				setTimeout(function() {
					uploader.destroy();
                }, 1);
            }

        }       
        //Ext.toast(message);
        this.fireEvent('uploaderror', this,error, message);
    },
    
    onUploaderDestroy(uploader){
        this.fireEvent('uploaddestroy', this);
    }


})
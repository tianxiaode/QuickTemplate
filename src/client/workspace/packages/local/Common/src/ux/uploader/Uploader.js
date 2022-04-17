Ext.define('Common.ux.uploader.Uploader',{
    extend:'Ext.Mixin',

    requires:[
        'Common.ux.uploader.File',
        'Common.ux.uploader.Status',
    ],

    mixinConfig: {
        configs: true,
        after:{
            initialize: 'initialize',
            destroy: 'destroy',
            onSelectFiles: 'onSelectFiles'
        }
    },

    entityName: 'File', //实体名称
    
    config:{
        autoStart: true, //自动开始上传
        storageType: null,
        fileMark: null,
        allowMimetype: null,
        allowType: 'jpg,png,iso',        
        allowSize: 10,
        chunkSize: 1024 * 1024 * 2,
        maxParallelUploads: 3,
        multiple: false,
        fileParameterName: 'file',
        progressCallbacksInterval: 500,
        speedSmoothingFactor: 0.1,
        method: 'multipart',
        maxChunkRetries: 3,
        uploadRoute: 'upload', //上传路由
        checkRoute: 'check',  //检查文件路由         
        mergeRoute: 'merge',  //合并文件路由
        checkFileResult: null, //文件检查结果
        totalCount: 0, //文件总数
        totalSize: 0, //总上传大小
        uploadedSize: 0, //已上传大小,
        hashList: null, //散列值列表
        uploadingCount: 0, //正在上传的文件
        uploading : null //正在上传的请求对象

    },


    applyAllowSize(size){
        if(Ext.isString(size)){
            size = Config.getFileOption(size) || '102400';
        }
        return size;
    },

    applyAllowType(type){        
        if(Ext.isString(type)) type = Config.getFileOption(type) || type;
        return type;
    },

    updateAllowSize(size){
        let inputEl = this.getInputElement();
        if(!inputEl) return;
        inputEl.set({ size: size});
    },

    updateAllowType(type){
        if(Ext.isEmpty(type)) return type;
        let me = this;
        let types = type.split(','),
            mimetype = [];
        types.forEach(t=>{
            let mt = Format.mimeType[t];
            if(mt) mimetype.push(mt);
        });
        me.setAllowMimetype(mimetype);

    },

    updateAllowMimetype(mimetype){
        if(!mimetype) return;
        let inputEl = this.getInputElement();
        if(!inputEl) return;
        inputEl.set({ accept: mimetype.join(',')});
    },

    getInputElement(){
        return this.inputElement || this.buttonElement;
    },

    initialize(){
        let me = this,
            inputEl = me.getInputElement();
        if(!inputEl){
            inputEl = me.inputElement = me.el.down('input');
            if(!inputEl) Ext.raise('File input is not defined');
        }
        inputEl.set({
            accept: me.getAllowMimetype().join(','),
            size: me.getAllowSize()
        });
        if(me.getMultiple()) inputEl.set({ multiple: 'multiple'});
        inputEl.on('change', me.onSelectFiles, me);
        me.files = {};
        me.hashList=[];
        me.checkFileResult = { length : 0};
        let entityName = me.getEntityName();
        me.uploadUrl = URI.crud(entityName, me.getUploadRoute());
        me.checkUrl = URI.crud(entityName, me.getCheckRoute());
        me.mergeUrl = URI.crud(entityName, me.getMergeRoute());
    },

    /**
     * 选择文件
     * @param {选择事件} e 
     * @param {目标} target 
     */
    onSelectFiles(e, target){
        let me = this,
            targetFiles = target.files,            
            files = [];
        //清理旧文件
        me.clearFiles();
        me.fireEvent('selectfiles', me, target.files);
        me.uploadChunks = [];
        me.merging = {};

        if(targetFiles.length === 0) return;

        let allowSize = me.getAllowSize(),
            formatAllowSize = Format.fileSize(allowSize),
            allowType = me.getAllowType(),
            mimetype = me.getAllowMimetype();

            
        //验证文件是否有效
        let isOk = Ext.each(targetFiles, f =>{
            let size =f.size,
                name = f.name || f.fileName;
            if(size > allowSize){
                MsgBox.alert(null, `<span class="text-danger">${Format.format(I18N.get('ExceedsAllowedSize'), name, formatAllowSize)}</span>`);
                return false;
            }
            if(!mimetype.includes(f.type)){
                MsgBox.alert(null, `<span class="text-danger">${Format.format(I18N.get('NotInAllowedFileType'), name, allowType)}</span>`);
                return false;
            }

            return true;

        });
        if(!isOk) return;
        
        Ext.each(targetFiles, f=>{
            let file = Ext.Factory.uploader({ 
                type: 'file',
                file: f,
                fileType: f.type,
                filename: f.name || f.fileName,
                size: f.size,
                chunkSize: me.getChunkSize(),
            });
            if(me.fireEvent('fileadded',me, file) !== false){ 
                if(!me.getMultiple() && files.length === 1) return false;
                files.push(file);
            }else{
                file.destroy();
            }
        })

        if(files.length === 0){
            MsgBox.alert(null, `<span class="text-danger">${I18N.get('NoFilesToUpload')}</span>`);
            return;
        }
        me.totalCount = files.length;
        me.computeHash(files);
    },

    /**
     * 中止
     */
    aborted(hash){
        let me = this,
            hashList = hash && [hash] || me.hashList;
        me.changeFileAndChunkStatus(hashList, [UploaderStatus.PENDING, UploaderStatus.UPLOADING ], UploaderStatus.ABORTED);
        // hashList.forEach(h=>{
        //     let f = files[h];
        //     if(!f || (f.status !== UploaderStatus.PENDING)) return;
        //     f.status = UploaderStatus.ABORTED;
        //     let chunks = f.chunks;
        //     chunks.forEach(c=>{
        //         if(c.status === UploaderStatus.PENDING || c.status === UploaderStatus.UPLOADING){
        //             c.status = UploaderStatus.ABORTED;
        //         }
        //     })
        // })
        Ext.iterate(me.uploading,(key,value)=>{
            let h = key.substr(0, key.indexOf('_'));
            if(hashList.includes(h)){
                value.abort();
            }
        })        
    },

    /**
     * 恢复
     */
    resume(hash){
        let me = this,
            hashList = hash && [hash] || me.hashList;
        me.changeFileAndChunkStatus(hashList, [UploaderStatus.ABORTED], UploaderStatus.PENDING);
        me.uploadingCount = 0;
        me.upload();

    },

    changeFileAndChunkStatus(hashList, oldStatus, newStatus){
        let files = this.files;
        hashList.forEach(h=>{
            let f = files[h];
            if(!f || !oldStatus.includes(f.status)) return;
            f.status = newStatus;
            let chunks = f.chunks;
            chunks.forEach(c=>{
                if(oldStatus.includes(c.status)){
                    c.status = newStatus;
                }
            })    
        })

    },

    /**
     * 移除
     */
    remove(hash){
        let me = this,
            hashList = hash && [hash] || me.hashList;
            files = me.files;
        hashList.forEach(h=>{
            let f = files[h];
            if(!f) return;
            f.destroy();
            delete files[h];
        })
    },

    /**
     * 销毁Uploader
     */
    
    destroy(){
        let me = this;
        me.clearFiles();
        me.callParent();
    },

    privates:{

        /**
         * 计算文件散列值
         * @param {文件} files 
         */
        computeHash(files){
            let me = this;
            files.forEach(f=>{
                f.on('filecomputehash', me.onFileComputeHash, me);
                f.computeHash();
            });
            //me.checkFile();
        },

        onFileComputeHash(file, hash){
            let me = this,
                hashList = me.hashList;
            me.files[hash] = file;            
            file.un('filecomputehash', me.onFileComputeHash, me);
            hashList.push(hash);
            me.fireEvent('computehash', me, file);
            me.uploadChunks = me.uploadChunks.concat(file.chunks);
            me.merging[hash] = false;
            me.checkFile(file, hash)
        },

        /**
         * 获取检查文件或合并文件参数
         * @param {文件} file 
         */
        getParams(file){
            let me = this;
            return {                
                hash: file.hash,
                size: file.size,
                storageType: me.getStorageType(),
                fileType: file.fileType,
                fileMark: me.getFileMark(),
                filename: file.filename,
                totalChunks: file.chunks.length,
            }
        },

        /**
         * 检查文件
         */
        checkFile(file, hash){
            let me = this;
            if(!file) return;
            if(me.fireEvent('checkfile', me, file) !== false){
                Http.post(me.checkUrl, me.getParams(file))
                .then(me.checkFileSuccess, me.checkFileFailure, null, me);
            }
            
        },

        /**
         * 检测文件成功
         * @param {响应} response 
         * @param {操作项} opts 
         */
        checkFileSuccess(response, opts){
            let me = this,
                data = Http.parseResponseText(response),
                result = data.result,
                files = me.files,
                hash = response.request.jsonData.hash,
                file = files[hash],
                checkFileResult = me.checkFileResult;
            if(!file)  Ext.raise(`file no found:${hash}`);
            me.totalSize += file.size;
            checkFileResult[hash] = result;
            checkFileResult.length++;
            if(result.isExits){
                //文件已存在
                file.status = UploaderStatus.MERGE;
            }
            //更改文件分片状态
            file.firstChunk = -1;
            file.chunks.forEach((c, index)=>{
                if(file.status === UploaderStatus.MERGE || result.uploaded[index]){
                    c.status = UploaderStatus.SUCCESS;
                    file.uploadedSize += (c.endPosition - c.startPosition);
                    file.chunkUploadCount++;
                }else{
                    if(file.firstChunk === -1) file.firstChunk = index;
                }
            })
            if(file.status !== UploaderStatus.MERGE &&  file.chunkUploadCount === file.chunks.length){
                file.status = UploaderStatus.COMPLETE;
            }
            me.fireEvent('checkfilesuccess', me, file, result);
            //检查是否已全部检测
            me.checkFileCompleted(checkFileResult, file);
        },

        /**
         * 检查文件失败
         * @param {响应} response 
         * @param {操作项} opts 
         */
        checkFileFailure(response){
            let me = this,
                error = Failure.getError(response),
                hash = response.request.jsonData.hash,
                checkFileResult = me.checkFileResult,
                file = me.files[hash];
            file.status = UploaderStatus.ERROR;
            checkFileResult[hash]={
                error: error
            }
            checkFileResult.length++;
            me.fireEvent('checkfileerror', me, file, error);
            //检查是否已全部检测
            me.checkFileCompleted(checkFileResult, file);
        },

        /**
         * 检查文件完成
         * @param {文件检查结果} checkFileResult 
         */
        checkFileCompleted(checkFileResult, file){
            let me = this;
            if(checkFileResult.length !== me.totalCount) return;
            me.uploadingCount = 0;
            // 已全部检测，开始上传
            if(me.getAutoStart()) {
                me.upload();
            }else{
                me.fireEvent('fileready',me, file);
            }
        },

        /**
         * 清理文件
         */
        clearFiles(){
            let me = this,
                hashList = me.hashList,
                files = me.files,
                checkFileResult = me.checkFileResult;
            hashList.forEach(hash=>{
                let f = files[hash];
                if(f && f.destroy) f.destroy();
                if(f) delete me.files[hash];
                if(checkFileResult[hash]) delete me.checkFileResult[hash];
            });
            Ext.iterate(me.uploading,(key,value)=>{
                delete me.uploading[key];
            })
            checkFileResult.length = 0;
            me.totalSize = 0;
            me.hashList = [];
            me.uploading = {};
            me.uploadedSize = 0;
        },

        /**
         * 开始上传
         */
        upload(){
            let me = this,
                hasUploading = false,
                maxParallelUploads = me.getMaxParallelUploads();
            let chunks = me.uploadChunks;
            Ext.each(chunks, c=>{
                let f = me.files[c.hash];
                //达到了最大上传数量，直接返回
                if(me.uploadingCount === maxParallelUploads) return false;
                if(c.status !== UploaderStatus.PENDING) return;
                if(f.firstChunk === c.offset){
                    me.fireEvent('filestart', me, f);
                }
                c.status = UploaderStatus.UPLOADING;
                me.uploadingCount++;
                hasUploading = true;
                me.send(c, f);
            })
            if(!hasUploading) me.merge();
        },

        /**
         * 获取分片上传参数
         * @param {分片} chunk 
         * @param {文件} file 
         */
        getUploadParams(chunk, file) {
            return Object.assign({
                index: chunk.offset,
                chunkSize: chunk.chunkSize,
                currentChunkSize: chunk.endPosition - chunk.startPosition,
            }, this.getParams(file));
        },    

        /**
         * 上传分片
         * @param {分片} chunk 
         * @param {文件} file 
         */
        send(chunk, file) {
            let me = this,
                blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                bytes = blobSlice.call(file.file, chunk.startPosition, chunk.endPosition);

            let params = me.getUploadParams(chunk, file),
                form = new FormData();
            //params[me.getFileParameterName()] = bytes;
            //     form = new FormData();
            
            Ext.iterate(params,(key,value)=>{
                form.append(key, value);
            })
    
            form.append(me.getFileParameterName(), bytes);

            let uploading = Http.upload(me.uploadUrl, form);
            me.uploading[`${file.hash}_${chunk.offset}`] = uploading;
            uploading.then(me.onUploadSuccess, me.onUploadFailure, null, me);
        },

        /**
         * 计算上传进度
         * @param {*} e 
         * @param {*} file 
         * @param {*} chunk 
         */   
        // onProgress(e, file, chunk){
        //     let me = this;
        //     if (e.lengthComputable) {
        //         me.loaded = e.loaded
        //         me.total = e.total
        //     }
        //     console.log('onProgress', arguments);
        //     me.fireEvent('progress', me, file, chunk, e);
        //     //me.fireEvent('chunkchange', me,  ChuckStatus.PROGRESS, e);
        // },
    
        /**
         * 分片上传完成
         * @param {*} e 
         * @param {*} file 
         * @param {*} chunk 
         */
        onUploadComplete(e, file, chunk){
            let me = this,
                target = e.target,
                status = Ext.data.request.Ajax.parseStatus(target.status, target); 
            if(status.success){
                me.fireEvent('chunkuploaded', me, file, chunk);
                chunk.status = UploaderStatus.SUCCESS;
                file.chunkUploadCount++;                
                if(file.chunkUploadCount === file.chunks.length){
                    //文件的已上传分片总数等于分片的长度，说明文件已上传完毕
                    file.status = UploaderStatus.COMPLETE;
                }
            }else{
                let error = Failure.getError(target);
                me.fireEvent('chunkerror', me, file, chunk, error);  
                if(chunk.retries < me.getMaxChunkRetries()){
                    //如果分片重试次数少于分片最大重试次数，安排重试
                    chunk.retries++;
                    chunk.status = ChuckStatus.PENDING;
                }else{
                    chunk.status = UploaderStatus.ERROR;
                }
            }
            me.uploadingCount--;
            me.upload();
    
        },

        onUploadSuccess(response){
            let me = this,
                files = me.files,
                formData = response.request.rawData,
                hash = formData.get('hash'),
                index = formData.get('index'),
                file = files[hash],
                chunk= file.chunks[index];
            me.fireEvent('chunkuploaded', me, file, chunk);
            file.uploadedSize += (chunk.endPosition - chunk.startPosition);
            me.fireEvent('fileprogress', me, file, file.uploadedSize/ file.size);
            chunk.status = UploaderStatus.SUCCESS;
            file.chunkUploadCount++;                
            if(file.chunkUploadCount === file.chunks.length){
                //文件的已上传分片总数等于分片的长度，说明文件已上传完毕
                file.status = UploaderStatus.COMPLETE;
            }
            me.uploadingCount--;
            me.upload();
        },

        onUploadFailure(response){
            let me = this,
                files = me.files,
                formData = response.request.rawData,
                hash = formData.get('hash'),
                index = formData.get('index'),
                error = Failure.getError(response),
                file = files[hash],
                chunk= file.chunks[index];
            if(chunk.status === ChuckStatus.ABORTED) return;
            me.fireEvent('chunkerror', me, file, chunk, error);  
            if(chunk.retries < me.getMaxChunkRetries()){
                //如果分片重试次数少于分片最大重试次数，安排重试                
                chunk.retries++;
                chunk.status = ChuckStatus.PENDING;
            }else{
                chunk.status = UploaderStatus.ERROR;
            }
            me.uploadingCount--;
            me.upload();
        },

        /**
         * 合并文件
         */
        merge(){
            let me = this,
                files = me.files;
            me.hashList.forEach(h=>{
                let f = files[h];
                if(!f) return;
                if(f.status === UploaderStatus.MERGE){
                    me.fireEvent('filesuccess', me, f, me.checkFileResult[h]);
                    return;
                }
                if(f.status !== UploaderStatus.COMPLETE)return;
                if(me.merging[h]) return;
                me.merging[h] = true;
                Http.post(me.mergeUrl, me.getParams(f))
                    .then(me.mergeFileSuccess, me.mergeFileFailure, null ,me);
            })
        },
   
        mergeFileSuccess(response){
            let me = this,
                files = me.files,
                hash = response.request.jsonData.hash,
                result = Http.parseResponseText(response),
                file = files[hash];                
            file.status = UploaderStatus.MERGE;
            me.fireEvent('filesuccess', me, file, result.result)
        },

        mergeFileFailure(response){
            let me  = this,
                files = me.files,
                hash = response.request.jsonData.hash,
                error = Failure.getError(response),
                file = files[hash];
            file.status = UploaderStatus.ERROR;
            me.fireEvent('filefailure', me, file, error);
        }

    }

});
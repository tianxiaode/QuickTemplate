Ext.define('Common.ux.uploader.File',{
    alias: 'uploader.file', 

    mixins:[
        'Ext.mixin.Observable',
        'Ext.mixin.Factoryable'
    ],

    requires:[
        'Common.ux.uploader.Chunk',        
    ],

    factoryConfig: {
      defaultType: 'file',  // this is the default deduced from the alias
      // other configs
    },

    file: null, //文件
    hash: null, //文件散列值
    fileType: null, //文件类型
    size : 0, //文件大小
    filename: null, //文件名
    //aborted: false, // 已中止
    //completed:false, // 已上传
    chunkSize: 0, //分片大小
    chunks: null, //分片
    //merged: false,  //已合并
    chunkUploadCount: 0, //分片已上传总数
    uploadedSize: 0,
    firstChunk: -1,

    constructor(config){
        let me = this;

        me.initConfig(config);
        //<debug>
        me.callParent([config]);
        //</debug>

        me.isInitializing = true;
        me.mixins.observable.constructor.call(me, config);
        me.isInitializing = false;

        me.chunks = [];
        me.status = UploaderStatus.PENDING;        
    },

    computeHash(){
        let me = this,
            size = me.size,
            blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = me.chunkSize, 
            chunks = Math.ceil(size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();
        let time = new Date().getTime();
        me.cmd5 = true; //文件状态为“计算md5...”    
        fileReader.onload = (e) => {
            spark.append(e.target.result);   // Append array buffer
            currentChunk++;
 
            if (currentChunk < chunks) {
                //console.log(`第${currentChunk}分片解析完成, 开始第${currentChunk +1} / ${chunks}分片解析`);
                loadNext();
            } else {
                //console.log('finished loading');
                let md5 = spark.end(); //得到md5
                //console.log(`MD5计算完成：${me.name} \nMD5：${md5} \n分片：${chunks} 大小:${size} 用时：${new Date().getTime() - time} ms`);
                spark.destroy(); //释放缓存
                //将文件md5赋值给文件唯一标识
                me.hash = md5;
                me.cmd5 = false; //取消计算md5状态
                me.initChunks();
                me.fireEvent('filecomputehash', me, md5);
                //me.checkFile();
            }
        };

        fileReader.onerror = function(){
            console.warn('oops, something went wrong.');
            me.cancel();
        };
 
        let loadNext = function(){
            let start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= size) ? size : (start + chunkSize);
            fileReader.readAsArrayBuffer(blobSlice.call(me.file, start, end));
        };
 
        loadNext();        
    },

    doDestroy(){
        let me = this,
            chunks = me.chunks;
        me.file = null;
        chunks.forEach(c => {
            c.doDestroy();            
        });
        me.chunks = null;
        me.callParent();
    },

  
    privates:{
        initChunks(){
            let me = this,
                size = me.size,
                chunkSize = me.chunkSize,
                count = Math.ceil(size / chunkSize);
            for (let offset = 0; offset < count; offset++) {
                let endPosition = Math.min(size, (offset + 1) * chunkSize);
                let chunk = Ext.Factory.uploader({
                    type: 'chunk',
                    offset: offset,
                    startPosition: offset * chunkSize,
                    endPosition: endPosition,
                    hash: me.hash
                });
                me.chunks.push(chunk);
            }
        },
      
  
    }
  
})
Ext.define('Common.ux.uploader.Chunk',{
    alias: 'uploader.chunk', 

    mixins:[
      'Ext.mixin.Factoryable'
    ],

    factoryConfig: {
        defaultType: 'chunk',  
    },    

    offset: null, //偏移量
    retries: 0, //重试次数
    status: null, //状态
    startPosition: 0, //开始位置
    endPosition: 0,   //结束位置
    hash: null,

    constructor(config){
        let me = this;
        me.initConfig(config);

        //<debug>
        me.callParent([config]);
        //</debug>

        me.status = UploaderStatus.PENDING;
    },
    
})
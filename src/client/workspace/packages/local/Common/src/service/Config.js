Ext.define('Common.service.Config', {
    alternateClassName: 'Config',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],

    config:{
        fileOptions: null,
        district: null
    },

    images:{},

    isReady: false,
    constructor(config){
        let me = this;
        me.mixins.observable.constructor.call(me, config);
        //me.loadConfiguration();
    },

    isAuthenticated(){
        let me = this;
        return me.data.currentUser && me.data.currentUser.id && me.data.user.currentUser > 0;
    },

    getCurrentUser(){
        return this.data.currentUser;
    },

    getPasswordSetting(){
        return this.data.passwordSetting;
    },

    getFileOption(key){
        let me = this,
            fileOptions = me.getFileOptions();
        return fileOptions[key];
    },

    loadConfiguration(){
        let me = this;
        me.isReady = false;
        let promise = Http.get(URI.get('application-configuration'));
        promise.then(me.loadConfigurationSuccess,null, null ,me);
        return promise;
    },

    getImage(hash){
        if(Ext.isEmpty(hash)) return null;
        return this.images[hash];
    },

    setImage(hash, url){
        if(Ext.isEmpty(hash)) return;
        this.images[hash] = url;
    },

    clearAll(){
        let me = this;
        me.isReady = false;
        me.data = null;
    },

    privates:{
        data: {},

        loadConfigurationSuccess(response){
            let me = this;
            let obj = Ext.decode(response.responseText, true);
            me.data = Object.assign({}, obj);
            //me.setFileOptions(result.fileOption);
            me.isReady = true;
            me.fireEvent('ready', result);
        },

        // onLoadPasswordSettingSuccess(response){
        //     let me = this,
        //         data = Http.parseResponseText(response);
        //     me.passwordSetting = data.result;
        // },

    
    },


});

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
        me.initConfig(config)
        me.mixins.observable.constructor.call(me, config);
    },

    isAuthenticated(){
        let me = this;
        return me.data.currentUser && me.data.currentUser.id && me.data.user.currentUser > 0;
    },

    getCurrentUser(){
        return this.data.currentUser;
    },

    getAuthData(){
        return this.data.auth;
    },

    getPasswordSetting(){
        let setting = Config.data.setting.values;
        return {
            requiredLength: setting['Abp.Identity.Password.RequiredLength'],
            requireDigit: setting['Abp.Identity.Password.RequireDigit'],
            requireLowercase: setting['Abp.Identity.Password.RequireLowercase'],
            requireUppercase: setting['Abp.Identity.Password.RequireUppercase'],
            requireNonAlphanumeric: setting['Abp.Identity.Password.RequireNonAlphanumeric'],
            requiredUniqueChars: setting['Abp.Identity.Password.RequiredUniqueChars']
        };
    },

    getFileOption(key){
        let me = this,
            fileOptions = me.getFileOptions();
        return fileOptions[key];
    },

    loadConfiguration(){
        let me = this;
        me.isReady = false;
        Http.get(URI.get('application-configuration'))
            .then(me.loadConfigurationSuccess, me.loadConfigurationFailure, null ,me);
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
            let me = this,
                data = Http.parseResponse(response);
            me.data = Object.assign({}, data);
            ACL.init();
            //me.setFileOptions(result.fileOption);
            me.isReady = true;
            me.fireEvent('ready', data);
        },

        loadConfigurationFailure(response){
            let error = Http.getError(response);
            MsgBox.alert(null, error);
        }

    
    },


});

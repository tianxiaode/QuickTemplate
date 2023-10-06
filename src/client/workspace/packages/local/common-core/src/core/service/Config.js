Ext.define('Common.core.service.Config', {
    alternateClassName: 'Config',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],


    isReady: false,

    constructor(config){
        let me = this;
        me.initConfig(config)
        me.mixins.observable.constructor.call(me, config);
    },

    getAppName(){
        return Ext.getApplication().getName();
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

    async loadConfiguration(){
        let me = this;
        me.isReady = false;
        let promise = Http.get(URI.get('application-configuration'));
        promise.then(me.loadConfigurationSuccess, me.loadConfigurationFailure, null ,me);
        return promise;
    },

    clearAll(){
        let me = this;
        me.isReady = false;
        me.data = null;
    },
    
    destroy() {
        let me = this;
        me.data = null;
        me.callParent();
    },

    privates:{
        data: {},

        loadConfigurationSuccess(response){
            let me = this,
                data = Http.parseResponse(response);
            me.data = Object.assign({}, data);
            //ACL.init();
            //me.setFileOptions(result.fileOption);
            me.isReady = true;
            console.log('loadConfigurationSuccess', me.data, Config.isReady )
            Ext.defer(me.fireEvent, 10, me,  ['ready',me]);
            //me.fireEvent('ready', data);
        },

        loadConfigurationFailure(response){
            let error = Http.getError(response);
            MsgBox.alert(null, error);
        }

    
    }// end privates


});

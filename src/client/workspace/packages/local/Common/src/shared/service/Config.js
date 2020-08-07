Ext.define('Common.shared.service.Config', {
    alternateClassName: 'ConfigService',
    singleton: true,

    requires:[
        'Common.shared.util.Url',
        'Common.shared.util.Failure',
        'Common.shared.service.Storage',
    ],

    isReady: false,
    constructor(){
        const me = this;
        //me.loadConfiguration();
    },

    isAuthenticated(){
        return this.data.currentUser && this.data.currentUser.isAuthenticated;
    },

    getCurrentOrganizationUnit(){
        return this.data.currentOrganizationUnit;
    },

    getCurrentUser(){
        return this.data.currentUser;
    },

    getSetting(){
        return this.data.setting.values;
    },

    loadConfiguration(){
        const me = this;
        me.isReady = false;
        const promise = Ext.Ajax.request({
            url: URI.get('Configuration', ''),
            withoutAuthorizationHeader: true,
            headers: {
                'Authorization' : 'Bearer ' +  StorageService.get('access_token'),
                "accept-language": StorageService.get('lang')  || (AppConfig.lang === 'zh-CN' ? 'zh-Hans' 
                : AppConfig.lang === 'zh-TW' ? 'zh-Hant' : AppConfig.lang )
            },
        });
        promise.then(me.loadConfigurationSuccess, Failure.ajax, null ,me);
        return promise;
    },

    privates:{
        data: {},


        loadConfigurationSuccess(response){
            const me = this;
            let obj = Ext.decode(response.responseText, true);
            if(!obj){
                MsgBox.alert(I18N.getDefaultMessageTitle(), I18N.getUnknownError());
                return;
            }
            me.data = Object.assign({}, obj);   
            me.isReady = true;
            Ext.fireEvent('configisready', obj)             
        },

    
    },



});

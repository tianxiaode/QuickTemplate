Ext.define('Common.service.Authentication',{
    alternateClassName: 'Auth',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable',
        'Common.oidc.UserManager'
    ],

    constructor(){
        let me = this,
            config = AppConfig,
            name = Ext.getApplication().getName().toLowerCase(),
            appConfig = config[name];
            issuer = appConfig && appConfig['issuer'],
            settings = {
                authority: config.authority,
                issuer: issuer || config.issuer,
                redirectUri: config.redirectUri,
                clientId: config.clientId,
                scope: config.scope,
                responseType: config.responseType        
            };
        me.settings
        me.userManger = Ext.create('oidc.usermanager', settings);
    },

    login(){
        let userManger = this.userManger;
        if(userManger.settings.responseType === 'code'){
            return 
        }
    }

})
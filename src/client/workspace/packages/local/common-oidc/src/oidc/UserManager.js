Ext.define('Common.odic.UserManager',{
    alias: 'odic.usermanager',

     client: null,
     redirectNavigator: null,
     popupNavigator: null,
     iframeNavigator: null,
     events: null,
     silentRenewService: null,
     sessionMonitor: null,

     constructor(userManagerSettings, redirectNavigator, popupNavigator, iframeNavigator){
        let me = this,
            settings;
        settings = me.settings = userManagerSettings.isInstance ? userManagerSettings : Ext.create('oidc.setting.usermanager', userManagerSettings);
        me.client = Ext.create('oidc.')
     }

});

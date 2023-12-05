Ext.define('Common.ux.button.Logout',{
    extend: 'Ext.Button',
    xtype: 'uxlogoutbutton',

    responsiveConfig:{
        'desktop && !cancel':{
            iconCls: 'x-fa fa-sign-out-alt',
            langTooltip: 'Logout',
            ui: 'header'
        },
        'phone && !cancel':{
            iconCls: 'md-icon-exit-to-app',
            ui: 'plain'
        }
    },

    initialize(){
        let me = this;
        me.callParent(arguments);
        me.on('tap', me.onLogout, me);
    },

    onLogout() {
        Alert.confirm(I18N.get('Logout'), I18N.get('LogoutMessage')).then(()=>{
            Config.clearAll();
            Auth.logout();                
        })
    },

    doDestroy() {
        let me = this;
        me.destroyMembers('responsiveConfig');
        me.callParent();
    }

})
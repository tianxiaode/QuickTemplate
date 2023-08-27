Ext.define('Common.ux.button.Logout',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxlogoutbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Logout';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-sign-out-alt';
        return 'md-icon-exit-to-app';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'header';
        return 'plain';
    },

    bind: { hidden: '{!isAuthenticated}'},

    initialize(){
        let me = this;
        me.callParent(arguments);
        me.on('tap', me.onLogout, me);
    },

    onLogout() {
        MsgBox.confirm(I18N.get('Logout'), I18N.get('LogoutMessage'),(btn)=>{
            if(btn !== 'yes') return;
            Config.clearAll();
            Auth.logout();                
        })
    },


})
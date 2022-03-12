Ext.define('Common.ux.button.Logout',{
    extend: 'Ext.Button',
    xtype: 'uxlogoutbutton',

    responsiveConfig:{
        desktop:{
            iconCls: 'x-fa fa-sign-out-alt',
            langTooltip: 'Logout',
            ui: 'header'
        },
        phone:{
            iconCls: 'md-icon-exit-to-app',
            ui: 'plain'
        }
    },

    //handler: 'onLogout', 
    //defaultListenerScope: true,
    bind: { hidden: '{!isAuthenticated}'},

    onLogout() {
        MsgBox.confirm(I18N.get('Logout'), I18N.get('LogoutMessage'),(btn)=>{
            if(btn === 'yes'){
                Auth.logout();
                window.location.href = '.';
            }
        })
    },

    initialize(){
        let me = this;
        me.callParent()
        me.on('tap', me.onLogout, me);
    }


})
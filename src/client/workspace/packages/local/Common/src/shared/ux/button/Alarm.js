Ext.define('Common.shared.ux.button.Alarm',{
    extend: 'Ext.Button',
    xtype: 'uxalarmbutton',

    responsiveConfig:{
        desktop:{
            ui: 'header',
            iconCls: 'x-far fa-bell',
            langTooltip: 'Alarm',

        },
        phone:{
            ui: 'plain phone-badge',
            iconCls: 'md-icon-notifications-none',
        }
    },

    arrow: false,
    reference: 'alarmButton',
    bind: { hidden: '{!isAuthenticated}', badgeText :  '{unreadBadgeText}'},

    
});

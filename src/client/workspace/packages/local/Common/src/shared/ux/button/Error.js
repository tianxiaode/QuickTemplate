Ext.define('Common.shared.ux.button.Error',{
    extend: 'Ext.Button',
    xtype: 'uxerrorbutton',

    tooltip: {
        langTitle: 'Errors',
        align: 'b-t',
        userCls: 'text-danger',
        zIndex: 1000,
        width: 200,
        autoCreate: true,
        anchor: true,
        hidden: true,
        autoHide: true,
        closable: true
    },                
    iconCls: 'x-far fa-times-circle text-danger',

    responsiveConfig:{
        desktop:{
            weight: 0,
            ui: 'error',
            minWidth:24,    
        },
        phone:{
            ui: 'plain',
            weight : 50,
        }
    },

    hidden: true,

})
Ext.define('Common.shared.ux.button.Success',{
    extend: 'Ext.Button',
    xtype: 'uxsuccessbutton',

    iconCls: 'x-far fa-check-circle text-success',                
    minWidth:24,
    weight: 5,
    tooltip: {
        langTitle: 'DefaultMessageTitle',
        align: 'b-t',
        userCls: 'text-success',
        autoCreate: true,
        width: 200,
        zIndex: 1000,
        anchor: true,
        hidden: true,
        autoHide: true,
        closable: true
    },

    responsiveConfig:{
        desktop:{
            weight: 0,
            ui: 'success',
            minWidth:24,    
        },
        phone:{
            ui: 'plain',
            weight : 50,
        }
    },

    hidden: true,

})
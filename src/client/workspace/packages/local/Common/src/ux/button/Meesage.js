Ext.define('Common.ux.button.Message',{
    extend: 'Ext.Button',
    xtype: 'uxmessagebutton',

    config:{
        error: false,
        message: null
    },

    hidden: true,

    tooltip: {
        langTitle: 'Errors',
        align: 'b-t',
        zIndex: 1001,
        width: 200,
        autoCreate: true,
        anchor: true,
        hidden: true,
        autoHide: true,
        closable: true
    },                

    responsiveConfig:{
        'desktop && !cancel':{
            weight: 4,
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 45,
        }
    },


    updateMessage(message){
        this.refreshTooltip(message);
    },

    refreshTooltip(message){
        let me = this,
            isError = me.getError(),
            iconCls = 'x-far fa-check-circle text-success',
            title = I18N.getDefaultMessageTitle(),
            tooltip = me.getTooltip();
        me.setMinWidth(32);
        if(isError){
            iconCls = 'x-far fa-times-circle text-danger',
            title = I18N.get('Errors')
        }
        me.setIconCls(iconCls);        
        if(!me.hasListener('tap')){
            me.on('tap', me.onShowTooltip, me);
        }
        tooltip.setTitle(title);        
        tooltip.setHtml(`<p class="m-0 p-0">${message}</p>`);
    },

    onShowTooltip(){
        this.getTooltip().show();
    }

})
/**
 * 包含IFrame的对话框
 */
Ext.define('Common.Desktop.ux.panel.IframeDialog', {
    extend: 'Common.Desktop.ux.panel.Dialog',
    xtype: 'uxiframedialog',

    requires:[
        'Ext.layout.Fit',
        'Common.Shared.ux.Iframe'
    ],

    layout:{
        type: 'fit',
        //align: 'stretch'
    },

    defaultListenerScope: true,
    minWidth: 1200,
    minHeight: '95%',

    buttons:{
        ok: {
            text: I18N.FinishStep,
            handler: 'onHide',
            ui:'action',
        },
        cancel: {ui: 'soft-grey', text: I18N.Cancel, handler: 'onHide'}
    },

    items:[
        {
            xtype: 'uxiframe',
            itemId: 'iframe',
            flex:1
        }
    ],

    load(url){
        let me= this,
            iframe = me.down('#iframe');
        iframe.load(url);
    },

    onHide: function(){
        this.hide();
    },

});
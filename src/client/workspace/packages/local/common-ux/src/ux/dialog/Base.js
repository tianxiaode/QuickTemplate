Ext.define('Common.ux.dialog.Base', {
    extend: "Ext.Dialog",

    requires:[
        'Common.ux.toolbar.Dialog',
    ],

    mixins:[
        'Common.mixin.Toolbar',
        'Common.mixin.DialogAction'
    ],

    config:{
        toolbar: { 
            xtype: 'uxdialogtoolbar',
            docked: 'bottom',
            saveButton:{ langText: 'OK'},
            defaults:{
                queryScope: 'isUxDialog'
            }
        }
    },

    isSaveClose: true,
    displayed: true,
    //closable: true,
    modal: true,
    height: 'auto',
    layout: "vbox",
    padding: "0 0",
    weighted: true,

    callback: null,
    cancelCallback: null,
    isSaved: false,
    isUxDialog: true,
    
    updateHeader(header){
        let me = this;
        me.callParent(arguments);
        if(Ext.platformTags.phone){
            header.setUi('dark');
            header.setIconCls('md-icon-arrow-back');
            me.headerIconElementListener = header.getTitle().iconElement.on('tap', me.close.bind(me));
    
        }else{
            me.setClosable(true);
        }
    },

    close(){
        let me = this,
            isSaved = me.isSaved,
            callback = me.callback,
            cancelCallback = me.cancelCallback,
            args = Array.prototype.slice.call(arguments);
        me.callParent();
        isSaved ? callback && callback.apply(null, args) : cancelCallback && cancelCallback.apply(null, args);
    },

    doDestroy() {
        let me = this;
        Ext.destroy(me.headerIconElementListener);
        me.destroyMembers('callback', 'cancelCallback');
        me.callParent(arguments);
    }

   
});
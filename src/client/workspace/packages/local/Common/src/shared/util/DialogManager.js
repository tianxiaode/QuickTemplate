Ext.define('Common.shared.util.DialogManager', {
    alternateClassName: 'DialogManager',
    singleton: true,

    dialogs: {},

    getDialog: function (xtype, config) {
        var me = this,
            dialog = me.dialogs[xtype];
        if (!dialog) {
            dialog = Ext.ClassManager.getByAlias('widget.' + xtype);
            if (dialog === undefined) Ext.raise('No class:' + xtype);
            if (typeof (dialog) === 'function') {
                dialog = Ext.create(dialog, Ext.clone(config));
            };
            me.dialogs[xtype] = dialog;
        }
        return dialog;
    },

    show(xtype, config){
        let me = DialogManager,
            dlg = me.getDialog(xtype,config);
        if(me.lastView) me.lastView.hide();
        if(dlg) dlg.show();
        me.lastView = me.globalPages.includes(xtype.toLocaleLowerCase()) ? dlg : null;
        return dlg;
    },

    hide(xtype){
        let me = DialogManager,
            dlg = me.dialogs[xtype];
        if(dlg) {
            dlg.hide();
            me.lastView = null;
        }
    },

    closeLastView(){
        let me = DialogManager;
        if(me.lastView) me.lastView.hide();
    }


});

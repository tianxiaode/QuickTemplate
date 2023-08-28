Ext.define('Common.ux.field.plugin.More', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.fieldmore',

    requires:[
        'Common.ux.field.trigger.More',
        'Common.ux.panel.MoreEditor'
    ],

    config:{
        owner: null,        
    },

    init(field) {
        let me = this;
        me.setOwner(field);

        field.addTrigger('more', {
            type: 'more',
            handler: me.onMoreIconTap,
            scope: me,
            weight: 100
        })
        
    },

    onMoreIconTap(sender, trigger, event){
        let me = this,
            dlg = ViewMgr.getDialog('uxmoreeditor');
        dlg.callback = Ext.bind(me.onUpdateValue, me);
        dlg.setValue(me.getOwner().getValue());
        dlg.show();
    },

    onUpdateValue(value){
        let editor = this.getOwner().up();
        editor.fireEvent('complete', editor, [value])
    },

    doDestroy() {
        let me = this;
        me.setOwner(null);
        me.cleanup();
        me.callParent();
    },
    
});
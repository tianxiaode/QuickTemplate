Ext.define("Common.overrides.dataview.DataView", {
    override: "Ext.dataview.DataView",

    onLocalized(){
        let me = this;
        if(me.setEmptyMessage) me.setEmptyMessage(I18N.get('EmptyText'));
        me.callParent();
    },



});

Ext.define("Common.overrides.shared.dataview.DataView", {
    override: "Ext.dataview.DataView",

    onLocalized(){
        const me = this;
        me.setEmptyMessage(I18N.get('EmptyText'));
        me.callParent();
    }

});

Ext.define('Common.overrides.dataview.plugin.ListPaging',{
    override: 'Ext.dataview.plugin.ListPaging',


    destroy: function() {
        Ext.destroy(this._storeListeners);
        this.cmp.remove(this.getLoadMoreCmp());
        this.callParent();
    },

})
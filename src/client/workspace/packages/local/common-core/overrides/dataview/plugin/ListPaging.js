Ext.define('Common.overrides.dataview.plugin.ListPaging',{
    override: 'Ext.dataview.plugin.ListPaging',


    destroy() {
        let me = this,
            loadMoreCmp = me.getLoadMoreCmp();
        Ext.destroy(me._storeListeners);
        Logger.debug(this.destroy, loadMoreCmp);
        me.cmp.remove(loadMoreCmp);
        me.destroyMembers(loadMoreCmp);
        me.callParent();
    },

})
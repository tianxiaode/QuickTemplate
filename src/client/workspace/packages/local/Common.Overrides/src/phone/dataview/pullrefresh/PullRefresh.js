Ext.define('Common.Overrides.shared.dataview.pullrefresh.PullRefresh',{
    override: 'Ext.dataview.pullrefresh.PullRefresh',

    privates:{
        fetchLatest: function() {
            let store = this.getList().getStore();
            if(store && store.fetch){
                this.getList().getStore().fetch({
                    page: 1,
                    start: 0,
                    callback: this.onLatestFetched,
                    scope: this
                });    
            }
        },        
    }

});
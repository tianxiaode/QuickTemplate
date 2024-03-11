Ext.define('Common.mixin.button.Search', {
    extend: 'Common.mixin.Component',

    config: {
        searchButton: null
    },


    createSearchButton(config) {
        let me = this,
            handler = 'onSearchButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            iconCls: IconCls.search,
            ownerCmp: me,
            handler: handler
        }, config);
    },

    applySearchButton(config, old) {
        return Ext.updateWidget(old, config,this, 'createSearchButton');
    },

    updateSearchButton(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('searchButton');
    }
})

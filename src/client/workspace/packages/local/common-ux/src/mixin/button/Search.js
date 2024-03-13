Ext.define('Common.mixin.button.Search', {
    extend: 'Common.mixin.Component',

    config: {
        searchButton: null
    },

    createSearchButton(config) {
        return Ext.apply({
            xtype: 'button',
            iconCls: IconCls.search,
            handler: 'onSearch',
            langTooltip: 'Search',
            isCrud: true,
            crudName: 'search',
            weight: 700,
            ownerCmp: this
        }, config, this.getDefaults());
        
    },

    applySearchButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createSearchButton');
    },

    updateSearchButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('searchButton');
    }


})

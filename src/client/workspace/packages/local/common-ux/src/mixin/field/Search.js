Ext.define('Common.mixin.field.Search',{
    extend: 'Common.mixin.Component',

    config:{
        searchField:{},
        searchFieldDefaults:{
            xtype:'searchfield',
            autoSearch: true,
            isSearch: true,
            langPlaceholder: 'Search',
            autoLabel: false,
            searchName: 'filter',
            userCls: 'mx-2',
            mixinName: 'searchField'
        },
        remoteFilter: true
    },

    applySearchField(config, old){
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'searchFieldDefaults');
    },

    updateSearchField(config){
        config && this.add(config);
    }

})
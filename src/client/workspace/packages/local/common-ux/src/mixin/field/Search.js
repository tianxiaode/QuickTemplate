Ext.define('Common.mixin.field.Search',{
    extend: 'Common.mixin.Component',

    config:{
        searchField:{},
        remoteFilter: true
    },

    createSearchField(config){
        return Ext.apply({
            xtype: 'searchfield',
            autoSearch: true,
            isSearch: true,
            langPlaceholder: 'Search',
            autoLabel: false,
            searchName: 'filter',
            userCls: 'mx-2',
            ownerCm : this
        }, config);
    },

    applySearchField(config, old){
        if(!config.width &&Ext.platformTags.desktop){
            config.width = 200;
        }
        return Ext.updateWidget(old, config, this, 'createSearchField');
    },

    updateSearchField(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('searchField');
    }


})
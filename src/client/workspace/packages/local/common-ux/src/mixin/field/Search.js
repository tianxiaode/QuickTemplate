Ext.define('Common.mixin.field.Search',{
    extend: 'Common.mixin.Component',

    config:{
        searchField:{},
        remoteFilter: true
    },

    createSearchField(config){
        let isPhone = Ext.platformTags.phone;
        return Ext.apply({
            xtype: 'searchfield',
            autoSearch: true,
            isSearch: true,
            langPlaceholder: 'Search',
            autoLabel: false,
            searchName: 'filter',
            userCls: 'mx-2',
            ownerCmp: this,
            width: !isPhone && 200 ,
            weight: 500
        }, config);
    },

    applySearchField(config, old){
        return Ext.updateWidget(old, config, this, 'createSearchField');
    },

    updateSearchField(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('searchField');
    }

})
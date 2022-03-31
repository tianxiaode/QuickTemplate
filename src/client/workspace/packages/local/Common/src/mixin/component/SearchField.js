Ext.define('Common.mixin.component.SearchField',{
    extend: 'Common.mixin.component.Base',

    config:{
        searchField:{
            xtype: 'uxsearchfield',
            searchHandler: 'onSearch',
            isSearch: true,
            searchName: 'filter',
        }
    },

    createSearchField(newCmp){
        let isPhone = Ext.platformTags.phone;
        return Ext.apply({
            ownerCmp: this,
            width: !isPhone && 140,
            flex: isPhone && 1,
            weight: !isPhone && 300,
        }, newCmp);
    },

    applySearchField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createSearchField');
    },

    initMixinComponent(me, container){
        let isPhone = Ext.platformTags.phone,
            field = me.getSearchField();
        !isPhone && container.add(field);
        isPhone && me.add(field);
    },


})
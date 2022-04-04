Ext.define('Common.mixin.component.SearchField',{
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.field.Search'
    ],

    searchFieldUi: null,
    config:{
        searchField:{
            xtype: 'uxsearchfield',
            isSearch: true,
            searchName: 'filter',
        }
    },

    hasSearchField: true,

    createSearchField(newCmp){
        let isPhone = Ext.platformTags.phone,
            ui = this.searchFieldUi;
        return Ext.apply({
            ownerCmp: this,
            ui: ui,
            width: !isPhone && 140 ,
            weight: 300,
            padding: ui === 'faded' && '0 5px'
        }, newCmp);
    },

    applySearchField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createSearchField');
    },

    initialize(){
        let me = this,
            container = me.getMixinContainer(),
            isPhone = Ext.platformTags.phone,
            field = me.getSearchField();
        if(!me.hasSearchField) return;
        !isPhone && container.add(field);
        isPhone && me.add(field);
    }


})
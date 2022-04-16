Ext.define('Common.mixin.component.SearchField',{
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.field.Search'
    ],

    config:{
        searchField:{
            xtype: 'uxsearchfield',
            isSearch: true,
            searchName: 'filter',
        }
    },

    searchFieldUi: null,
    hasSearchField: true,
    searchFieldMixinContainer: null,

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
            searchFieldMixinContainer = me.searchFieldMixinContainer,
            container = (searchFieldMixinContainer === 'self' && me)
                ||  (searchFieldMixinContainer && me.down(searchFieldMixinContainer)) 
                || me.getMixinContainer();
            field = me.getSearchField();
        if(!me.hasSearchField) return;
        container.add(field);
        if(me.isPhone() && container.isCrudToolbar){
            field.setUi('solo');
            field.setWidth(null);
            field.setFlex(1);
            field.setMargin('0 5px 0 0');
            return;
        }
    }


})
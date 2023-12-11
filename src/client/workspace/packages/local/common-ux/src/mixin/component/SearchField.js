Ext.define('Common.mixin.component.SearchField',{
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.field.Search'
    ],

    config:{
        searchField:{}
    },

    createSearchField(config){
        let isPhone = Ext.platformTags.phone;
        return Ext.apply({
            xtype: 'uxsearchfield',
            isSearch: true,
            searchName: 'filter',
            ownerCmp: this,
            width: !isPhone && 140 ,
            weight: 300,
            padding: ui === 'faded' && '0 5px'
        }, config);
    },

    applySearchField(config, old){
        return Ext.updateWidget(old, config, this, 'createSearchField');
    },

    updateSearchField(config){
        if(!config) return;
        let me = this;
        if(me.isPhone() && me.isCrudToolbar){
            field.setUi('solo');
            field.setWidth(null);
            field.setFlex(1);
            field.setMargin('0 5px 0 0');
            return;
        }

    },

    doDestroy() {
        this.destroyMembers('searchField');
    }




})
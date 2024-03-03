Ext.define('Common.mixin.field.Search',{
    extend: 'Common.mixin.Component',

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
            autoSearch: true,
            isSearch: true,
            searchName: 'filter',
            ownerCmp: this,
            width: !isPhone && 200 ,
            weight: 500,
            padding: config.ui === 'faded' && '0 5px'
        }, config);
    },

    applySearchField(config, old){
        return Ext.updateWidget(old, config, this, 'createSearchField');
    },

    updateSearchField(config){
        if(!config) return;
        let me = this;
        if(Ext.platformTags.phone && me.isCrudToolbar){
            field.setUi('solo');
            field.setWidth(null);
            field.setFlex(1);
            field.setMargin('0 5px 0 0');
        }
        me.add(config);

    },

    doDestroy() {
        this.destroyMembers('searchField');
    }




})
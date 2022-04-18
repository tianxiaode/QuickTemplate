Ext.define('Common.ux.crud.container.Tree',{
    extend: 'Common.ux.crud.container.Base',

    requires:[
        'Ext.grid.Tree'
    ],

    mixins:[
        'Common.ux.crud.container.mixin.Phone',
        'Common.mixin.component.Back',
    ],


    profiles:{
        desktop:{
            hasBack: false,
        },
        phone:{
            searchFieldMixinContainer: 'self',
            searchFieldUi: 'search',
            toolbarUi: 'dark',
            backMixinContainer: '[isCrudToolbar]',
        }
    },

    config:{
        tree:{
            xtype: 'tree',
            isCrudList: true,
            autoLoad: false,
            flex: 1,
            weight:200,
            scrollable: 'y',    
            bind:{ store: '{mainStore}'},
            columns:[
                { 
                    xtype: 'treecolumn',
                    dataIndex: 'displayName', 
                    cell:{  encodeHtml: false,},
                    flex: 1
                },
            ]
        },
        searchList:{
            xtype: 'grid',
            isSearchList: true,
            hidden: true,
            flex:1,
            weight:100,
            bind: {store: '{searchStore}'},
            columns:[
                { dataIndex: '' },
                { dataIndex: '' }
            ]
        }
    },

    createTree(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyTree(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createTree');
    },

    updateTree(config){
        if(config) this.add(config);
    },

    createSearchList(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applySearchList(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSearchList');
    },

    updateSearchList(config){
        if(config) this.add(config);
    },

    beforeInitialize(config){
        let me = this,
            isPhone = me.isPhone();
        isPhone && Ext.apply(me, me.profiles.phone);
        !isPhone && Ext.apply(me, me.profiles.desktop);
        me.callParent(arguments);
    },



})
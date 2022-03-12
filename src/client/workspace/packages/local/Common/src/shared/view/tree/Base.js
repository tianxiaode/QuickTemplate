Ext.define('Common.view.tree.Base',{
    extend: 'Ext.Panel',
    xtype: 'commonshared-treebase',

    requires: [
        'Ext.layout.Card',
        'Ext.grid.Tree',
        'Ext.dataview.List',
        'Common.ux.grid.Tree',
        'Ext.panel.Resizer',
        'Common.ux.grid.CrudToolbar',
        'Common.ux.dataview.List'
    ],

    layout: 'vbox',
    isSingleView: false,

    config:{
        crudToolbar:{},
        searchField:{
            xtype: 'uxsearchfield',
            searchHandler: 'onSearch',
            isSearch: true,
            searchName: 'query',
        },
        treeHideHeaders: true,
        columns:[
            { 
                xtype: 'treecolumn',
                autoText: false,
                dataIndex: 'displayName', 
                flex: 1
             },
        ]
    },

    responsiveConfig:{
        desktop:{
            padding:5,
        },
        phone:{
            ui: 'dark',
            header:{
                xtype: 'uxpanelheader',
                buttons:{
                    //swap: { xtype: 'uxswapbutton'},
                    crate: true,
                    update: { xtype: 'uxupdatebutton', isCrud: true, crudName: 'update'},
                    trash: { xtype: 'uxtrashbutton', isCrud: true, crudName: 'delete'},
                    refresh: { xtype: 'uxrefreshbutton'}
                },
                hasSelectMenu: false,
            },
        }
    },

    applyCrudToolbar(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createCrudToolbar');
    },

    createCrudToolbar(newCmp) {
        let me = this;
        return Ext.apply({
            xtype: 'uxcrudtoolbar',
            ownerCmp: me,
            //hasPaging : me.hasPaging,
            hasCountMessage: false,
            hasSearch: me.isSingleView,
            hasCrud: true
        }, newCmp);
    },


    applySearchField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createSearchField');
    },

    createSearchField(newCmp){
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            scope: me
        }, newCmp);
    },

    items:[
        {
            xtype: 'container',
            layout: 'card',
            flex:1,
            items:[
                {
                    xtype: 'tree',
                    itemId: 'treeList',
                    isCrudList: true,
                    autoLoad: false,
                    scrollable: 'y',    
                    bind:{ store: '{treeMainStore}'},

                },
                {
                    xtype: 'uxlist',
                    hasPaging:false,
                    hasPullRefresh: false,
                    itemId: 'searchList',
                    bind: {store: '{treeSearch}'},
                    itemTpl: 'treeSearchItem'
                }             
            ]
        }
    ],


    initialize() {
        let me = this,
            tree = me.down('#treeList');
 
        me.callParent();
 
        if(!me.isSingleView) me.insert(0, me.getSearchField());
        if(Ext.platformTags.desktop) {
            me.insert(0,me.getCrudToolbar());
            me.setHeader(null);
            if(!me.isSingleView){
                me.setMinWidth(250);
                me.setMaxWidth(500);
                me.setResizable({
                    split: true,
                    edges: 'east'    
                })
            }
        }else{
            let search = me.getSearchField();
            search.setUi('faded');
            search.setMargin('5 5 0 5');
            search.setStyle('padding: 0;');
        }
        tree.setColumns(me.getColumns());
        if(!me.getTreeHideHeaders()) tree.setHideHeaders(false);

    },



})
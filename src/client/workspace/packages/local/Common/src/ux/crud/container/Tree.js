Ext.define('Common.ux.crud.container.Tree',{
    extend: 'Common.ux.crud.container.Base',

    requires:[
        'Ext.grid.Tree'
    ],

    defaultResponsive:{
        desktop:{
            hasBack: false,
        },
        phone:{
            searchFieldMixinContainer: 'self',
            searchFieldUi: 'search',
        
            toolbarUi: 'dark',
            backMixinContainer: '[isCrudToolbar]',        
        },
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




})
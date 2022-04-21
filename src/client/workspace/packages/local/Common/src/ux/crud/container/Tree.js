Ext.define('Common.ux.crud.container.Tree',{
    extend: 'Common.ux.crud.container.Base',

    requires:[
        'Ext.grid.Tree'
    ],

    defaultResponsive:{
        phone:{
            searchFieldMixinContainer: 'self',
            searchFieldUi: 'search',
        
            toolbarUi: 'dark',
            backMixinContainer: '[isCrudToolbar]',        
        },
    },

    useDefaultColumn: true,
    defaultColum: { 
        xtype: 'treecolumn',
        dataIndex: 'displayName', 
        renderer: Format.gridHighlight,
        cell:{  encodeHtml: false,},
        flex: 1,
    },

    config:{
        columns: null,
        tree:{
            xtype: 'tree',
            isCrudList: true,
            autoLoad: false,
            flex: 1,
            weight:200,
            scrollable: 'y',    
            bind:{ store: '{mainStore}'},
        },
    },

    createTree(newCmp) {
        let me = this,
            defaultColumn = Ext.clone(me.defaultColum),
            columns = me.getColumns();
        columns = me.useDefaultColumn ? [defaultColumn].concat(columns || []): columns;
        return Ext.apply({
            ownerCmp: this,
            columns: columns
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
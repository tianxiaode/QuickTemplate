Ext.define('Common.ux.crud.container.Tree',{
    extend: 'Common.ux.crud.container.Base',

    requires:[
        'Ext.grid.Tree',
        'Common.ux.grid.column.Action'
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
    useActionColumn: true,
    defaultColum: { 
        xtype: 'treecolumn',
        dataIndex: 'displayName', 
        renderer: Format.gridHighlight,
        cell:{  encodeHtml: false,},
        minWidth: 200,
        flex: 1,

    },
    actionColumn:{
        xtype: 'uxactioncolumn',
    },

    config:{
        columns: null,
        tree:{
            xtype: 'tree',
            isCrudList: true,
            childTap: true,
            autoLoad: false,
            flex: 1,
            weight:500,
            scrollable: 'y',    
            bind:{ store: '{mainStore}'},
        },
    },

    createTree(newCmp) {
        let me = this,
            defaultColumn = Ext.clone(me.defaultColum),
            columns = me.getColumns();
        columns = me.useDefaultColumn ? [defaultColumn].concat(columns || []): columns;
        me.useActionColumn && columns.push(Ext.clone(me.actionColumn));
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
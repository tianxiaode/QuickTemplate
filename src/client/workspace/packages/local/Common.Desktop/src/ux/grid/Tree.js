Ext.define('Common.Desktop.ux.grid.Tree',{
    extend: 'Ext.Panel',
    xtype: 'uxtree',

    requires: [
        'Ext.panel.Resizer',
        'Ext.layout.VBox',
        'Ext.grid.Tree',
        'Ext.Toolbar',
        'Ext.dataview.List',
        'Common.Shared.ux.field.Search',
        'Common.Desktop.ux.grid.TreeController',
    ],

    minWidth: 250,
    maxWidth: 500,
    padding:5,
    resizable: {
        split: true,
        edges: 'east'
    },

    config:{
        entityName: null,

        grouped: false,
        useCreateButton: true,
        useEditButton: true,
        useDeleteButton: true,
        useRefreshButton: true,
        useSearchField: true
    },

    controller: 'uxtree',

    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items:[
        {
            xtype: 'container',
            docked: 'top',
            padding: '5px',
            defaults: {
                margin: '0 10px 0 '
            },
            border: true,
            shadow: false,
            style: 'background-color:#fff;border-bottom:1px solid var(--divider-color);',
                
            layout: {
                type: 'box',
                vertical: false,
                pack: 'left'
            },
            defaultType: 'button',            
            items:[
                {           
                    xtype: 'uxcreatebutton',
                    weight: 70,
                    itemId: 'create',
                    hidden: true,
                    handler: 'onAddedEntity', 
                },
                {
                    xtype: 'uxeditbutton',
                    weight: 80,
                    itemId: 'edit',
                    hidden: true,
                    disabled:true,
                    handler: 'onEditedEntity', 
                },
                {
                    xtype: 'uxtrashbutton',
                    weight: 90,
                    itemId: 'delete',
                    hidden: true,
                    disabled:true,
                    handler: 'onDeletedEntity', 
                },
                {
                    xtype: 'uxrefreshbutton',
                    weight: 100,
                    itemId: 'refresh',
                    handler: 'onRefreshStore', 
                }    
            ]
        },
        {
            width: '100%',
            xtype: 'uxsearchfield',
            itemId: 'query'            
        },
        {
            xtype: 'list',
            hidden: true,
            itemCls: 'listing',
            flex:1,
            bind: {store: '{searchTreeStore}'}
        },
        {
            xtype: 'tree',
            emptyText: I18N.EmptyText,
            scrollable: 'y',    
            autoText: false,
            hideHeaders: true,
            flex:1,
            columns:[
                { 
                    xtype: 'treecolumn',
                    autoText: false,
                    dataIndex: 'displayName', 
                    flex: 1
                 },
            ],
            bind:{ store: '{treeMainStore}'}
        }
    ],

    //将实体名称首字母转大写
    applyEntityName: function(entityName){
        if(Ext.isEmpty(entityName)) Ext.raise('No entityName defined');
        return Ext.String.capitalize(entityName);
    },

    applyUseSearchField(value){
        this.down('#query').setHidden(!value);
        return value;
    },

    applyUseRefreshButton(value){
        this.down('#refresh').setHidden(!value);
        return value;
    }

})
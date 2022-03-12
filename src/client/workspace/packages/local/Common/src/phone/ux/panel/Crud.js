Ext.define('Common.phone.ux.panel.Crud',{
    extend: 'Ext.Panel',

    requires:[
        'Common.ux.panel.Header',
        'Common.ux.button.Update',
        'Common.ux.button.Trash',
        'Common.ux.button.Swap',
        'Common.ux.dataview.ListToolbar',
    ],

    ui: 'dark',
    layout: 'vbox',

    hasSearchField: false,
    //hasMultiSelect: true,
    hasCopyToolbar: false,
    includeResource: true,

    config:{
        header:{
            xtype: 'uxpanelheader',
            buttons:{
                //swap: { xtype: 'uxswapbutton'},
                create: true,
                trash: true,
                update: { xtype: 'uxupdatebutton', isCrud: true, crudName: 'update'},
                //trash: { xtype: 'uxtrashbutton', isCrud: true, crudName: 'delete'},
                //refresh: { xtype: 'uxrefreshbutton'}
            },
        },
        searchField:{
            xtype: 'uxsearchfield',
            searchHandler: 'onSearch',
            ui: 'faded',
            margin: '5 5 0 5',
            style: 'padding: 0;',
            isSearch: true,
            searchName: 'query',
        },
        // selectToolbar:{
        //     mode: 'select',
        //     hasUpdate: true,
        //     hasDelete: true,
        //     hasCopy: false,
        // },
        copyToolbar:{
            mode: 'copy',
            hasUpdate: false,
            hasDelete: false,
            hasCopy: true,
        }
    },

    createComponent(newCmp) {
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },

    applySearchField(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    createToolbar(newCmp){
        return Ext.apply({
            ownerCmp: this,
            xtype: 'uxlisttoolbar',
            docked: 'bottom',
            hidden: true,
            listeners:{
                hiddenchange: 'onListToolbarHiddenChange'
            }
        }, newCmp);

    },

    // applySelectToolbar(newCmp, old){
    //     return Ext.updateWidget(old, newCmp,
    //         this, 'createToolbar');
    // },

    applyCopyToolbar(newCmp,old){
        return Ext.updateWidget(old, newCmp,
            this, 'createToolbar');
    },

    layout: 'vbox',

    initialize(){
        let me = this;
            list = me.down('uxlist')
            itemConfig = list && list.getItemConfig();
        me.callParent();
        if(me.hasSearchField){
            me.insert(0, me.getSearchField());
        }
        // if(list && me.hasMultiSelect){
        //     me.add(me.getSelectToolbar());
        //     itemConfig = me.addItemTool(itemConfig, 'check',{
        //         iconCls: 'x-fi md-icon-check-box-outline-blank',
        //         handler: 'onListItemSelect',
        //         hidden: true
        //     })
        // }
        if(list && me.hasCopyToolbar){
            me.add(me.getCopyToolbar());
            itemConfig = me.addItemTool(itemConfig, 'paste',{
                iconCls: 'x-fa fa-paste',
                handler: 'onListItemPaste',
                hidden: true                
            })
        }
        // if(list && itemConfig){
        //     list.setItemConfig(itemConfig);
        // }

    },

    addItemTool(itemConfig, toolName, config){
        itemConfig = itemConfig || {};
        let tools = itemConfig.tools || {};
        tools[toolName] = config;
        itemConfig.tools = tools;
        return itemConfig;
    }


})
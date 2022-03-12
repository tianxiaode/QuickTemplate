Ext.define('Common.ux.panel.SelectList',{
    extend: 'Ext.Panel',
    xtype: 'uxselectlist',

    requires:[
        'Common.ux.dataview.List',
        'Ext.dataview.plugin.ListPaging',
        'Common.ux.field.Search'
    ],    

    // responsiveConfig:{
    //     desktop:{
    //         width: 400,
    //         maxWidth: 400,
    //         height: 600,
    //     },
    //     phone:{
    //         ui: 'dark',
    //         autoTabIndex: false,
    //         header:{
    //             xtype: 'uxpanelheader',
    //             hasSelectAllMenu: false,
    //         }
    //     }
    // },

    layout: 'vbox',
    minHeight: 300,
    maxHeight: 300,
    padding: 5,
    defaultListenerScope: true,
    
    config:{
        itemTpl: null,
        itemCls: null,
        store: null,
        searchValue: null,
        searchFieldName: null,
        queryMode: 'remote',
        list:{
            xtype: 'uxlist',
        },
        searchField:{
            xtype: 'uxsearchfield',
            searchHandler: 'onSearch',
            margin: 5,
            style: 'padding: 0;',
            isSearch: true,
            searchName: 'query',
        },
    },

    applyList(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createList');
    },

    createList(newCmp){
        let me = this,
            pageSize = me.getStore().getPageSize();
        return Ext.apply({
            ownerCmp: me,
            store: me.getStore(),
            itemTpl: me.getItemTpl(),
            itemCls: me.getIconCls(),
            hasPaging: pageSize >0,
            listeners: {
                select: me.onSelected,
                scope: me
            }
        }, newCmp);
    },

    createSearchField(newCmp) {
        let me = this,
            defaultConfig = null;
        if(Ext.platformTags.phone){
            defaultConfig={
                ui: 'faded',
            }
        }
        return Ext.apply({
            ownerCmp: me
        }, newCmp,defaultConfig);
    },

    applySearchField(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSearchField');
    },

    initialize(){
        let me = this;

        me.add(me.getSearchField());
        me.add(me.getList());
    },

    updateSearchValue(value){
        let me = this,
            list = me.getList(),
            selection = list.getSelectable().getSelections()[0],
            store = me.getStore(),
            field = me.getSearchField(),
            current = field.getValue();
        if(selection && (selection.getId() === value.id)) return;
        field.setValue(value[me.ownerCmp.getDisplayField()]);
    },

    onSearch(sender){
        let me = this,
            value = sender.getValue(),
            list = me.getList(),
            store = list.getStore();
        if(me.getQueryMode() === 'local'){
            store.filter({
                property: me.getSearchFieldName(),
                value: value,
                anyMatch: true
            });
            if(!store.isLoaded() && !Ext.isEmpty(store.getProxy().getUrl())){
                store.load();
            }
        }else{
            let proxy = store.getProxy();
            proxy.extraParams.query = value;    
            store.load();
        }
    },

    onSelected(seder, selected){
        let me = this;
        if(me.initSelected) return;
        me.hide();
        me.fireEvent('select', me, selected);
    },

    setSelected(selected){
        let me = this;
        me.initSelected = true;
        me.getList().getSelectable().select(selected);
        me.initSelected = false;
    }


})
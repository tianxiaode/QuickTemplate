Ext.define('Common.shared.ux.grid.CrudToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'uxcrudtoolbar',

    requires:[
        // 'Common.shared.ux.button.First',
        // 'Common.shared.ux.button.Previous',
        // 'Common.shared.ux.field.PageNumber',
        // 'Common.shared.ux.button.Next',
        // 'Common.shared.ux.button.Last',
        'Common.shared.ux.button.Create',
        'Common.shared.ux.button.Update',
        'Common.shared.ux.button.Trash',
        'Common.shared.ux.button.Refresh',
        'Common.shared.ux.field.Search',
        'Common.shared.ux.field.PageNumber',
    ],

    //shadow: false,
    ui: 'grid',
    //style: 'background-color:var(--background-color);',
    //classCls: Ext.baseCSSPrefix + 'pagingtoolbar',

    defaults:{
        margin: '0 5px 0 0'
    },
    //hasPaging: true,
    hasCountMessage: true,
    hasSearch: true,
    hasCrud: true,
    hasDelete: true,
    hasCreate: true,
    hasUpdate: true,
    weighted: true,
    config: {
        createButton:{
            xtype: 'uxcreatebutton',
            isCrud: true,
            crudName: 'create'
        },
        updateButton:{
            xtype: 'uxupdatebutton',
            isCrud: true,
            crudName: 'update'
        },
        deleteButton:{
            xtype: 'uxtrashbutton',
            isCrud: true,
            crudName: 'delete'
        },
        refreshButton:{
            xtype: 'uxrefreshbutton',
            isCrud: true,
            crudName: 'refresh'
        },
        searchField: {
            weight: 300,
            xtype: 'uxsearchfield',
            searchHandler: 'onSearch',
            width: 140,
            isSearch: true,
            searchName: 'query',
        },
        fill:{
            xtype: 'component',
            flex:1,
            weight: 490,
        },
        countMessage:{            
            xtype: 'component',
            isCrud: true,
            crudName: 'countmessage',
            weight: 500
        }    
    },
 
    //inheritUi: false,

    applyUi(ui){
        if(Ext.platformTags.phone) return 'dark';
        return ui;
    },
 
    initialize() {
        let me = this;
 
        me.callParent();

        if(Ext.platformTags.phone){
            me.setUi('dark');
        }

        if(me.hasCrud){
            let buttons = [];
            if(me.hasCreate) buttons.push(me.getCreateButton());
            if(me.hasUpdate) buttons.push(me.getUpdateButton());
            if(me.hasDelete) buttons.push(me.getDeleteButton());
            if(buttons.length>0) me.add(buttons);
        }

        me.add(me.getRefreshButton());


        if(me.hasSearch){
            me.add(me.getSearchField());
        }

        if(me.hasCountMessage){
            me.add([
                me.getFill(),
                me.getCountMessage()
            ]);

        }

    },
 
   
    createComponent(newCmp) {
        return Ext.apply({
            //margin: '0 5px 0 0',
            ownerCmp: this
        }, newCmp);
    },


    applyCreateButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyUpdateButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyDeleteButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyRefreshButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applySearchField(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyFill(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyCountMessage(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

});
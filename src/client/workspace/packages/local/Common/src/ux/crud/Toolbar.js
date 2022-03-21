Ext.define('Common.ux.crud.Toolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'uxcrudtoolbar',

    requires:[
        'Common.ux.button.Create',
        'Common.ux.button.Update',
        'Common.ux.button.Trash',
        'Common.ux.button.Refresh',
        'Common.ux.field.Search',
        'Common.ux.crud.CountMessage',
    ],

    ui: 'grid',

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
            xtype: 'uxcountmessage',
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
Ext.define('Common.ux.crud.Grid',{
    extend: 'Common.ux.grid.Grid',
    xtype: 'uxcrudgrid',

    requires:[
        'Ext.grid.column.RowNumberer',
        'Common.ux.grid.CrudToolbar',
        'Common.app.CrudController'
    ],

    hasCountMessage: true,
    hasCrud: true,
    hasCreate: true,
    hasUpdate: true,
    hasDelete: true,
    hasSearch: true,
    autoLoad: true,
    includeResource: true,
    rowNumbers: true,
    doubleTapToEdit: false,
    childTap: false,
    hasCrudToolbar: true,
    isCrudList: true,
    
    config:{
        crudToolbar:{},
    },

    selectable:{
        checkbox: true
    },

    bind: { store: '{mainStore}'}, 

    createComponent(newCmp) {
        let me = this;
        return Ext.apply({
            xtype: 'uxcrudtoolbar',
            docked: 'top',
            ownerCmp: this,
            hasCountMessage: me.hasCountMessage,
            hasSearch: me.hasSearch,
            hasCrud: me.hasCrud,
            hasCreate: me.hasCreate,
            hasUpdate: me.hasUpdate,
            hasDelete: me.hasDelete
        }, newCmp);
    },

    applyCrudToolbar(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    updateCrudToolbar(config){
        if(!this.hasCrudToolbar) return;
        if(config) this.insert(0,config);
    },


})
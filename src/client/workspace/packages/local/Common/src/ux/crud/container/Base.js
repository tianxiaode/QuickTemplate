Ext.define('Common.ux.crud.container.Base',{
    extend: 'Ext.Container',
    xtype: 'uxcrudcontainer',

    isCrudPanel: true,

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.SearchField',
    ],

    requires:[
        'Ext.grid.column.RowNumberer',
        'Common.ux.grid.Grid',
        'Common.ux.dataview.List',
    ],

    config:{
        toolbarUi: 'grid',
        toolbar:{
            xtype: 'toolbar',
            isCrudToolbar: true,
            weighted: true,
            shadow: false,
            weight: 10,
        },
        grid:{
            xtype: 'uxgrid',
            autoLoad: true,
            rowNumbers: true,
            doubleTapToEdit: false,
            childTap: false,
            isCrudList: true,
            weight: 500,
            
            selectable:{
                checkbox: true
            },
        
            bind: { store: '{mainStore}'},         
        },
        list:{
            xtype: 'uxlist',
            isCrudList: true,
            hasPullRefresh: true,
            childTap: true,
            childLongPress: false,
            weight: 500,
            bind:{ store: '{mainStore}'},    
            selectable:{
                mode: 'MULTI'
            }        
        }
    },

    layout: 'vbox',
    weighted: true,
    useGrid: true,
    useList: false,

    applyToolbarUi(ui){
        if(this.isPhone()) return 'dark';
        return ui;
    },

    createToolbar(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            ui: this.getToolbarUi()
        }, newCmp);
    },

    applyToolbar(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createToolbar');
    },

    updateToolbar(config){
        if(config) this.add(config);
        this.onLocalized();
    },

    createGrid(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyGrid(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createGrid');
    },

    updateGrid(config){
        if(config && this.useGrid) this.add(config);
    },

    createList(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyList(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createList');
    },

    updateList(config){
        console.log('updateList')
        if(config && this.useList) this.add(config);
    },


})
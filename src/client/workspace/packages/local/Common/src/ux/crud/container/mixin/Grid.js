Ext.define('Common.ux.crud.container.mixin.Grid',{
    extend: 'Ext.Mixin',

    requires:[
        'Ext.grid.column.RowNumberer',
        'Common.ux.grid.Grid'
    ],

    mixinConfig: {
        configs: true,
    },

    config:{
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
    },

    useGrid: true,

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

})
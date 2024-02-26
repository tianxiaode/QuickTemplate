Ext.define('Common.ux.crud.container.mixin.Grid',{
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.grid.column.RowNumberer',
        'Common.ux.grid.column.Action',
        'Common.ux.grid.Grid'
    ],

    config:{
        grid: null
    },

    createGrid(config) {
        return Ext.apply({
            xtype: 'uxgrid',
            autoLoad: true,
            rowNumbers: true,
            doubleTapToEdit: false,
            childTap: false,
            isCrudList: true,
            weight: 200,
            
            selectable:{
                checkbox: true
            },
        
            bind: { store: '{mainStore}'},         
            ownerCmp: this,
        }, config);
    },

    applyGrid(config, old) {
        return Ext.updateWidget(old, config, this, 'createGrid');
    },

    updateGrid(config){
        if(!config) return;
        let me = this,
            container = (me.getContainer && me.getContainer()) || me;
        container.add(config);
    },

    doDestroy(){
        this.destroyMembers('grid');
    }

})
Ext.define('Common.ux.crud.Grid',{
    extend: 'Common.ux.grid.Grid',
    xtype: 'uxcrudgrid',

    requires:[
        'Ext.grid.column.RowNumberer',
    ],

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


})
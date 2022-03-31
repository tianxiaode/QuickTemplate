Ext.define('Common.ux.crud.Grid',{
    extend: 'Common.ux.grid.Grid',
    xtype: 'uxcrudgrid',

    requires:[
        'Ext.grid.column.RowNumberer',
    ],

    autoLoad: true,
    includeResource: true,
    rowNumbers: true,
    doubleTapToEdit: false,
    childTap: false,
    isCrudList: true,
    
    selectable:{
        checkbox: true
    },

    bind: { store: '{mainStore}'}, 


})
Ext.define('Common.ux.grid.Grid',{
    extend: 'Ext.grid.Grid',
    xtype: 'uxgrid',

    requires:[
        'Common.ux.grid.column.CheckChange',
        'Common.ux.grid.column.Date',
        'Common.core.util.Format',
        'Common.ux.grid.column.Highlight'
    ],

    config:{
        grouped: false,
    },

    selectable: {
        checkbox: true,
        mode: "multi"
    },

    rowNumbers: true


    


})

 
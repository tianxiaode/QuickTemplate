Ext.define('Common.ux.grid.Grid',{
    extend: 'Ext.grid.Grid',
    xtype: 'uxgrid',

    requires:[
        'Ext.dataview.plugin.ListPaging',
        'Common.ux.grid.column.CheckChange',
        'Common.ux.grid.column.Date',
    ],

    config:{
        grouped: false,
    },

    selectable: {
        checkbox: true,
        mode: "multi"
    }
    


})

 
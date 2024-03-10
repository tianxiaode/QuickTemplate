Ext.define('Common.ux.grid.Grid',{
    extend: 'Ext.grid.Grid',
    xtype: 'uxgrid',

    requires:[
        'Common.ux.grid.column.Date',
        'Common.core.util.Format',
        'Common.ux.grid.column.Highlight'
    ],

    mixins:[
        'Common.mixin.grid.CheckChange',
        'Common.mixin.Normalize',
        'Common.mixin.grid.ActionColumn'
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

 
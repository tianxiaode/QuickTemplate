Ext.define('Common.ux.grid.column.CheckChange',{
    extend: 'Ext.grid.column.Check',
    xtype: 'uxcheckchangecolumn',

    width: 80, 
    listeners: { 
        checkchange: 'onCheckChange' 
    } 
})

Ext.define('Common.ux.field.PageNumber',{
    extend: 'Ext.field.Number',
    xtype: 'uxpagenumberfield',

    isPaging: true,
    pagingName: 'pagenumber',
    weight: 30,                
    width: 60,
    clearable: false,
    minValue: 1,
    decimals:0,
    value:1,
    autoLabel: false,

})
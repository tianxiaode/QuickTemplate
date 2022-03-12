Ext.define('Common.ux.field.ComboBox',{
    extend: 'Ext.field.Picker',
    xtype: 'uxcombobox',

    itemCls: 'listing',
    displayField: 'displayName',
    valueField: 'id',
    triggerAction: 'query',
    queryParam: 'query',
    queryMode: 'remote',
    picker: 'floated',
    //forceSelection: true,
    minChars: 2,
    clearable: true,



})
Ext.define('Common.ux.dataview.plugin.IntEditor',{
    extend: 'Common.ux.dataview.plugin.LabelEditor',
    alias: 'plugin.dataviewinteditor',

    labelSelector: 'x-editable-int',

    requires:[
        'Ext.field.Number'
    ],

    field:{
        xtype: 'numberfield',
        autoLabel: false,
        decimals: 0,
        allowOnlyWhitespace: false,
        selectOnFocus: true
    }

})
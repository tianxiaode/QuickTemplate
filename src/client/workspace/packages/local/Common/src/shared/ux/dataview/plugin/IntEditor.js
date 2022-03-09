Ext.define('Common.shared.ux.dataview.plugin.IntEditor',{
    extend: 'Common.shared.ux.dataview.plugin.LabelEditor',
    alias: 'plugin.dataviewinteditor',

    labelSelector: 'x-editable-2',

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
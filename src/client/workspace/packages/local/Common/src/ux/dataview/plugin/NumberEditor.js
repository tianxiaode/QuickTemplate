Ext.define('Common.ux.dataview.plugin.NumberEditor',{
    extend: 'Common.ux.dataview.plugin.LabelEditor',
    alias: 'plugin.dataviewnumbereditor',

    labelSelector: 'x-editable-number',

    requires:[
        'Ext.field.Number'
    ],

    field:{
        xtype: 'numberfield',
        autoLabel: false,
        decimals: 2,
        allowOnlyWhitespace: false,
        selectOnFocus: true
    }

})
Ext.define('Common.shared.ux.dataview.plugin.NumberEditor',{
    extend: 'Common.shared.ux.dataview.plugin.LabelEditor',
    alias: 'plugin.dataviewnumbereditor',

    labelSelector: 'x-editable-3',

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
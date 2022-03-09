Ext.define('Common.shared.ux.dataview.plugin.DateEditor',{
    extend: 'Common.shared.ux.dataview.plugin.LabelEditor',
    alias: 'plugin.dataviewdateeditor',

    labelSelector: 'x-editable-4',

    requires:[
        'Common.shared.ux.field.DateTime',
    ],

    field:{
        xtype: 'uxdatetimefield',
        autoLabel: false,
        decimals: 0,
        allowOnlyWhitespace: false,
        selectOnFocus: true
    },
    
    onSave: function(ed, value) {
        let me = this;
        me.activeRecord.set(me.dataIndex, value);
    }

})
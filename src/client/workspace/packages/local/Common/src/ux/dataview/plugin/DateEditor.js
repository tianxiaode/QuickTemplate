Ext.define('Common.ux.dataview.plugin.DateEditor',{
    extend: 'Common.ux.dataview.plugin.LabelEditor',
    alias: 'plugin.dataviewdateeditor',

    labelSelector: 'x-editable-date',

    requires:[
        'Common.ux.field.DateTime',
    ],

    field:{
        xtype: 'uxdatetimefield',
        autoLabel: false,
        decimals: 0,
        allowOnlyWhitespace: false,
        selectOnFocus: true
    },
    
    onSave(ed, value) {
        let me = this;
        me.activeRecord.set(me.dataIndex, value);
    }

})
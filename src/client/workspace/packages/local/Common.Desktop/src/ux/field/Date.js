/**
 * 添加年份和月份选择的日期选择字段
 */
Ext.define('Common.Desktop.ux.field.Date',{
    extend: 'Ext.field.Date',
    xtype: 'uxdatefield',

    requires:[
        'Common.Desktop.ux.panel.Date'
    ],

    floatedPicker: {
        xtype: 'uxdatepanel',
        autoConfirm: true,
        floated: true,
        showTodayButton:true,
        buttonAlign: 'center',
        buttons:{
            spacer: false,
            ok: false,
            cancel: false
        },
        showFooter: true,
        listeners: {
            tabout: 'onTabOut',
            select: 'onPickerChange',
            scope: 'owner'
        },
        keyMap: {
            ESC: 'onTabOut',
            scope: 'owner'
        },
    },

    dataType: {
        dateWriteFormat: 'Y-m-d'
    },

    createFloatedPicker: function() {
        var me = this,
            minDate = this.getMinDate(),
            maxDate = this.getMaxDate();
        return Ext.merge({
            yearFrom: minDate ? minDate.getFullYear() : (new Date().getFullYear() - 20),
            yearTo: maxDate ? maxDate.getFullYear() : (new Date().getFullYear() + 20),
        }, me.getFloatedPicker());
    },

});
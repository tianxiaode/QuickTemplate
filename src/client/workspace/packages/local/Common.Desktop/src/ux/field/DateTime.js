/**
 * 添加了时间输入的日期时间选择字段
 */
Ext.define('Common.Desktop.ux.field.DateTime',{
    extend: 'Common.Desktop.ux.field.Date',
    xtype: 'uxdatetimefield',

    requires:[
        'Common.Desktop.ux.panel.DateTime'
    ],

    config:{
        hour: 0,
        minute: 0,
        second: 0,
    },

    floatedPicker: {
        xtype: 'uxdatetimepanel',
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
            hourchange: 'onHourChange',
            minutechange: 'onMinuteChange',
            secondchange: 'onSecondChange',
            scope: 'owner'
        },
        keyMap: {
            ESC: 'onTabOut',
            scope: 'owner'
        },
    },

    dataType: {
        // type: 'date'  (datefield does this by default)
        dateWriteFormat: I18N.DefaultDatetimeFormat
    },
    dateFormat: I18N.DefaultDatetimeFormat,

    onHourChange(sender, newValue, oldValue){
        if(newValue !== oldValue){
            this.setHour(newValue);
        }
    },

    onMinuteChange(sender, newValue, oldValue){
        if(newValue !== oldValue){
            this.setMinute(newValue);
        }
    },

    onSecondChange(sender, newValue, oldValue){
        if(newValue !== oldValue){
            this.setSecond(newValue);
        }
    },

    updateHour(hour){
        let me = this,
            value = me.getValue();
        if(Ext.isDate(value)) value.setHours(hour);
        return hour;
    },

    updateMinute(minute){
        let me = this,
            value = me.getValue();
        if(Ext.isDate(value)) value.setMinutes(minute);
        return minute;
    },

    updateSecond(second){
        let me = this,
            value = me.getValue();
        if(Ext.isDate(value)) value.setSeconds(second);
        return second;
    },

    // initialize(){
    //     let me = this,
    //         picker = me.getPicker();
    //     me.callParent();
    //     picker.add({
    //         xtype: 'container', 
    //         layout:{
    //             type: 'hbox',
    //             align: 'center'
    //         },
    //         docked: 'bottom', 
    //         items:[
    //             { xtype: 'component', flex:1},
    //             { 
    //                 xtype: 'spinnerfield', autoLabel: false, minValue:0 ,maxValue:23, decimals: 0, width:80,
    //                 itemId:'hourField', value: me.getHour(),
    //                 listeners:{change : me.onHourChange, scope: me}
    //             },
    //             { xtype: 'component',html: ':', style: 'line-height:32px;padding: 0 5px;'},
    //             { 
    //                 xtype: 'spinnerfield', autoLabel: false, minValue:0 ,maxValue:59, decimals: 0,width:80,
    //                 itemId:'minuteField',value: me.getMinute(),
    //                 listeners:{change : me.onMinuteChange, scope: me}
    //             },
    //             { xtype: 'component', html: ':', style: 'line-height:32px;padding: 0 5px;'},
    //             { 
    //                 xtype: 'spinnerfield', autoLabel: false, minValue:0 ,maxValue:59, decimals: 0,width:80,
    //                 itemId:'secondField',value: me.getSecond(),
    //                 listeners:{change : me.onSecondChange, scope: me}
    //             },
    //             { xtype: 'component', flex:1},
    //         ] 
    //     });
    // },

    applyValue: function(value, oldValue) {
        let me = this;
        if (!(value || value === 0)) {
            value = null;
        }

        value = this.callParent([value, oldValue]);

        if (value) {
            if (this.isConfiguring) {
                this.originalValue = value;
            }

            me.setHour(value.getHours());
            me.setMinute(value.getMinutes());
            me.setSecond(value.getSeconds());
            // The same date value may not be the same reference, so compare them by time.
            // If we have dates for both, then compare the time. If they're the same we
            // don't need to do anything.
            if (Ext.isDate(value) && Ext.isDate(oldValue) && value.getTime() === oldValue.getTime()) {
                me.setTimeValue();
                return;
            }
        }else{
            me.setHour(0);
            me.setMinute(0);
            me.setSecond(0);
        }

        me.setTimeValue();

        return value;
    },

    setTimeValue(){
        let me = this,
            picker = me.getPicker();
        if(picker && picker.down){
            let hour = picker.down('#hourField'),
                minute = picker.down('#minuteField'),
                second = picker.down('#secondField');
            if(hour && hour.setValue) hour.setValue(me.getHour());
            if(minute && minute.setValue) minute.setValue(me.getMinute());
            if(second && second.setValue) second.setValue(me.getSecond());
        }

    },
            
    onPickerChange: function(picker, value) {
        var me = this;

        if (me.$ignorePickerChange) {
            return;
        }

        if(Ext.isDate(value)){
            value.setHours(me.getHour());
            value.setMinutes(me.getMinute());
            value.setSeconds(me.getSecond());

        }
        me.forceInputChange = true;
        me.setValue(value);
        me.forceInputChange = false;
        me.fireEvent('select', me, value);

        me.onTabOut(picker);
    },
    
    updatePickerValue: function (picker, value) {
        picker.setValue(value);
    },

    parseValue: function(value, errors) {
        var me = this,
            date = value,
            defaultFormat = me.getDateFormat(),
            altFormats = me.getAltFormats(),
            formats = altFormats ? [defaultFormat].concat(altFormats) : [defaultFormat],
            formatsLength = formats.length,
            i, format;
 
        if (date) {
            if (!Ext.isDate(date)) {
                for (i = 0; i < formatsLength; i++) {
                    format = formats[i];
                    date = Ext.Date.parse(
                        value + ' ' + me.initTime,
                        format + ' ' + me.initTimeFormat
                    );
 
                    if (date) {
                        return date;
                    }
                }
            }
 
            if (date !== null) {
                return date;
            }
        }
 
        return this.callParent([value, errors]);
    },
     
});
/**
 * 添加了时间输入的日期时间面板
 */
Ext.define('Common.Desktop.ux.panel.DateTime',{
    extend: 'Common.Desktop.ux.panel.Date',
    xtype: 'uxdatetimepanel',

    requires:[
        'Ext.field.Spinner'
    ],

    //dateFormat: I18N.DefaultDatetimeFormat,

    onHourChange(sender, newValue, oldValue){
        if(newValue !== oldValue){
            let me = this;
            me.fireEvent('hourchange', me, newValue);
        }
    },

    onMinuteChange(sender, newValue, oldValue){
        if(newValue !== oldValue){
            let me = this;
            me.fireEvent('minutechange', me, newValue);
        }
    },

    onSecondChange(sender, newValue, oldValue){
        if(newValue !== oldValue){
            let me = this;
            me.fireEvent('secondchange', me, newValue);
        }
    },

    initialize: function() {
        var me = this;

        me.callParent();

        me.add({
            xtype: 'container', 
            style:{
                backgroundColor: '#fafafa'
            },
            layout:{
                type: 'hbox',
                align: 'center'
            },
            docked: 'bottom', 
            items:[
                { xtype: 'component', flex:1},
                { 
                    xtype: 'spinnerfield', autoLabel: false, minValue:0 ,maxValue:23, decimals: 0, width:80,
                    itemId:'hourField',
                    listeners:{change : me.onHourChange, scope:me}
                },
                { xtype: 'component',html: ':', style: 'line-height:32px;padding: 0 5px;'},
                { 
                    xtype: 'spinnerfield', autoLabel: false, minValue:0 ,maxValue:59, decimals: 0,width:80,
                    itemId:'minuteField',
                    listeners:{change : me.onMinuteChange, scope: me}
                },
                { xtype: 'component', html: ':', style: 'line-height:32px;padding: 0 5px;'},
                { 
                    xtype: 'spinnerfield', autoLabel: false, minValue:0 ,maxValue:59, decimals: 0,width:80,
                    itemId:'secondField',
                    listeners:{change : me.onSecondChange, scope: me}
                },
                { xtype: 'component', flex:1},
            ] 
        })

    },

    // applyValue: function(date) {
    //     if (typeof date === 'string') {
    //         date = Ext.Date.parse(date, this.getFormat());
    //     }
    //     // This is to make sure the default value doesn't get stale
    //     // in long running apps
    //     else if (!date) {
    //         date = new Date();
    //     }

    //     if(Ext.isDate(date)){
    //         let me = this;
    //         me.setHour(date.getHours());
    //         me.setMinute(date.getMinutes());
    //         me.setSecond(date.getSeconds());

    //         let hour = me.down('#hourField'),
    //             minute = me.down('#minuteField'),
    //             second = me.down('#secondField');
    //         if(hour && hour.setValue) hour.setValue(me.getHour());
    //         if(minute && minute.setValue) minute.setValue(me.getMinute());
    //         if(second && second.setValue) second.setValue(me.getSecond());

    //     }

    //     return Ext.isDate(date) ? Ext.Date.clearTime(date, true) : null;
    // },

    // updateValue: function(value, oldValue) {
    //     var me = this,
    //         handler = me.getHandler(),
    //         selectedCls = me.selectedCls,
    //         cell;

    //     if (oldValue) {
    //         cell = me.getCellByDate(oldValue);

    //         if (cell) {
    //             Ext.fly(cell).removeCls(selectedCls);
    //         }
    //     }

    //     if (!me.isConfiguring) {
    //         if (me.hasFocus) {
    //             me.focusDate(value);
    //         }
    //         else {
    //             me.setFocusableDate(value);
    //         }

    //         cell = me.getCellByDate(value);

    //         if (cell) {
    //             Ext.fly(cell).addCls(selectedCls);
    //         }

    //         me.setTitleByDate(value);
    //         let returnValue = value;
    //         returnValue.setHours(me.getHour());
    //         returnValue.setMinutes(me.getMinute());
    //         returnValue.setSeconds(me.getSecond());

    //         me.fireEvent('change', me, returnValue, oldValue);

    //         if (handler) {
    //             Ext.callback(handler, me.scope, [me, returnValue, oldValue]);
    //         }
    //     }
    // },

    // onDateClick: function(e) {
    //     var me = this,
    //         cell = e.getTarget(me.cellSelector, me.bodyElement),
    //         date = cell && cell.date,
    //         focus = true,
    //         disabled = cell && cell.disabled;

    //     // Click could land on element other than date cell
    //     if (!date || me.getDisabled()) {
    //         return;
    //     }

    //     if (!disabled) {
    //         me.setValue(date);

    //         if (me.getAutoConfirm()) {
    //             // Touch events change focus on tap.
    //             // Prevent this as we are just about to hide.
    //             // PickerFields revert focus to themselves in a beforehide handler.
    //             if (e.pointerType === 'touch') {
    //                 e.preventDefault();
    //             }

    //             focus = false;

    //             let returnValue = date;
    //             returnValue.setHours(me.getHour());
    //             returnValue.setMinutes(me.getMinute());
    //             returnValue.setSeconds(me.getSecond());
    //             console.log('onDateClick',returnValue)
    //             me.fireEvent('select', me, returnValue);
    //         }
    //     }

    //     if (focus) {
    //         // Even though setValue might focus the date, we may
    //         // either be in a position where the date is disabled
    //         // or already set.
    //         me.focusDate(date);
    //     }
    // },

});
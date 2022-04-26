Ext.define('Common.ux.field.DateTime',{
    extend: 'Ext.field.Date',
    xtype: 'uxdatetimefield',

    requires:[
        'Common.ux.panel.DateTime',
        'Common.ux.field.trigger.DateTime'
   ],

   config:{
            
        hour: 0,
        minute: 0,
        second: 0,
        //dateFormat: Format.defaultDateTimeFormat,
    },

    // dataType: {
    //     // type: 'date'  (datefield does this by default)
    //     dateWriteFormat:  Format.defaultDateTimeFormat
    // },

    picker: 'floated',

    floatedPicker: {
        xtype: 'uxdatetimepanel',
        autoConfirm: true,
        floated: true,
        listeners: {
            tabout: 'onTabOut',
            timechange: 'onTimeChange',
            select: 'onPickerChange',
            scope: 'owner'
        },
        keyMap: {
            ESC: 'onTabOut',
            scope: 'owner'
        },
    },

    parseValue(value, errors) {
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
                        date.setHours(me.getHour())
                        date.setMinutes(me.getMinute())
                        date.setSeconds(me.getSecond())
                        return date;
                    }
                }
            }

            if (date !== null) {
                date.setHours(me.getHour())
                date.setMinutes(me.getMinute())
                date.setSeconds(me.getSecond())
                return date;
            }
        }


        return this.callParent([value, errors]);
    },

    onTimeChange(sender, hour , minute, second){
        let me = this;
        me.setHour(hour);
        me.setMinute(minute);
        me.setSecond(second);
    },

    applyValue(value, oldValue) {
        if (!(value || value === 0)) {
            value = null;
        }

        value = this.callParent([value, oldValue]);

        //console.log('applyValue', value);

        if (value) {
            if (this.isConfiguring) {
                this.originalValue = value;
            }

            // The same date value may not be the same reference, so compare them by time.
            // If we have dates for both, then compare the time. If they're the same we
            // don't need to do anything.
            if (
                Ext.isDate(value) &&
                Ext.isDate(oldValue) &&
                value.getTime() === oldValue.getTime()
            ) {
                return;
            }
        }

        return value;
    },

    // updateValue(value, oldValue) {
    //     let me = this;

    //     if(Ext.isDate(value)){
    //         me.setHour(value.getHours());
    //         me.setMinute(value.getMinutes());
    //         me.setSecond(value.getSeconds());
    //     }

    //     me.setTimeValue();
     
    //     me.callParent([value, oldValue]);
    // },

    
    setTimeValue(){
        let me = this,
            picker = me.getPicker();
        if(!picker) return;
        picker.setTimeValue(me.getHour(), me.getMinute(), me.getSecond());

    },

    showPicker() {
        var me = this,
            alignTarget = me[me.alignTarget],
            picker = me.getPicker();

        // TODO: what if virtual keyboard is present

        if (me.pickerType === 'floated') {
            if (me.getMatchFieldWidth()) {
                picker.setWidth(alignTarget.getWidth());
            }

            me.setTimeValue();

            picker.showBy(alignTarget, me.getFloatedPickerAlign(), {
                minHeight: 100
            });

            // Collapse on touch outside this component tree.
            // Because touch platforms do not focus document.body on touch
            // so no focusleave would occur to trigger a collapse.
            me.touchListeners = Ext.getDoc().on({
                // Do not translate on non-touch platforms.
                // mousedown will blur the field.
                translate: false,
                touchstart: me.collapseIf,
                scope: me,
                delegated: false,
                destroyable: true
            });
        }
        else {
            me.setShowPickerValue(picker);
            picker.show();
        }
    },



    onPickerChange(picker, value) {
        var me = this;
 
        if (me.$ignorePickerChange) {
            return;
        }
 
        if(Ext.isDate(value)){
            value.setHours(me.getHour());
            value.setMinutes(me.getMinute());
            value.setSeconds(me.getSecond());
        }
        
        me.forceSetValue(value);

        me.fireEvent('select', me, value);
 
        me.onTabOut(picker);
    },    

    privates:{
        realignFloatedPicker: function(picker) {
            var me = this;
    
            picker = picker || me.getConfig('picker', false, true);
    
            if (picker && picker.isVisible()) {
                let pickerValue = picker.getValue(),
                    value = me.getValue();
                if(pickerValue && pickerValue.getTime() === value && value.getTime()) return;
                
                if (me.getMatchFieldWidth()) {
                    picker.setWidth(me[me.alignTarget].getWidth());
                }
    
                picker.realign(me[me.alignTarget], me.getFloatedPickerAlign(), {
                    minHeight: 100
                });
    
                // If some keyboard gesture caused this, then there is an active location
                // which we don't want to disturb.
                if (!Ext.keyboardMode) {
                    me.setPickerLocation();
                }
            }
        },
    
    },

    onLocalized(){
        let me = this;
        me.callParent();
        me.setDateFormat(Format.defaultDateTimeFormat);
        me.setDataType({
            type: 'date',
            dateWriteFormat: Format.defaultDateTimeFormat
        })
    }


});
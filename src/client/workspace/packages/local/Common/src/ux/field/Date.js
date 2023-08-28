Ext.define('Common.ux.field.Date', {
    extend: 'Ext.field.Date',
    xtype: 'uxdatefield',

    requires: [
        'Common.ux.panel.Date'
    ],

    picker: 'floated',

    floatedPicker: {
        xtype: 'uxdatepanel',
        autoConfirm: true,
        zIndex: 1000,
        floated: true,
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

    // edgePicker: {
    //     xtype: 'datepicker',
    //     height: 200,
    //     cover: true
    // },

    setPickerLocation(fromKeyboard) {
        var me = this,
            pickerType = me.pickerType,
            picker = me.getPicker(),
            value = picker.getValue(),
            limit;

        me.$ignorePickerChange = true;

        if (value != null) {
            picker.setValue(value);
        }
        else if (pickerType === 'edge') {
            picker.setValue(new Date());
        }

        delete me.$ignorePickerChange;

        if (pickerType === 'floated') {
            picker.el.dom.tabIndex = -1;

            limit = me.getMinDate();


            if (limit) {
                picker.setMinDate(limit);
            }

            limit = me.getMaxDate();

            if (limit) {
                picker.setMaxDate(limit);
            }

            value = value || new Date();


            // Ensure the carousel is at the correct position wth no animation.
            picker.setValueWithoutAnim(value);

            if (fromKeyboard) {
                picker.focusDate(value);
            }
        }
    },


    privates: {
        realignFloatedPicker(picker) {
            var me = this;

            picker = picker || me.getConfig('picker', false, true);

            if (picker && picker.isVisible()) {
                let pickerValue = picker.getValue(),
                    value = me.getValue();
                if (pickerValue && pickerValue.getTime() === value && value.getTime()) return;

                if (Ext.platformTags.desktop) {
                    if (me.getMatchFieldWidth()) {
                        picker.setWidth(me[me.alignTarget].getWidth());
                    }

                    picker.realign(me[me.alignTarget], me.getFloatedPickerAlign(), {
                        minHeight: 100
                    });
                } else {
                    picker.setWidth('90%');
                }

                // If some keyboard gesture caused this, then there is an active location
                // which we don't want to disturb.
                if (!Ext.keyboardMode) {
                    me.setPickerLocation();
                }
            }
        },


    },

    onLocalized() {
        let me = this;
        me.callParent();
        me.setDateFormat(Format.defaultDateFormat);
        me.setDataType({
            type: 'date',
            dateWriteFormat: Format.defaultDateFormat
        })
    }


});
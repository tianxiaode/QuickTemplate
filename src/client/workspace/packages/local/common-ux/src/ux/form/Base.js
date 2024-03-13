Ext.define('Common.ux.form.Base', {
    extend: 'Ext.form.Panel',
    xtype: 'uxformpanel',

    requires: [
        'Ext.field.Hidden',
        'Ext.field.Password',
        'Ext.field.Text',
        'Ext.field.ComboBox',
        'Ext.field.Checkbox',
        'Ext.field.Radio',
        'Ext.field.Hidden',
        'Ext.field.Email',
        'Ext.field.Number',
        'Ext.field.Container'
    ],

    mixins: [
        'Common.mixin.field.EnterEvent',
        'Common.mixin.field.Id',
        'Common.mixin.field.ConcurrencyStamp',
    ],

    layout: 'auto',
    weighted: true,

    userCls: 'flex-wrap-item',

    defaultType: 'textfield',
    trackResetOnLoad: true,
    isReady: false,

    config: {
        cols: 1,
        labelWidth: 120,
    },

    autoLabelAlign: true,

    defaults: {
        errorTarget: 'under',
        userCls: 'mx-1 fixed-field-error-message',
        separatorAlign: 'field'
    },

    initialize() {
        let me = this;
        me.callParent();
        me.initForm();
    },

    initForm() {
        let me = this,
            items = me.getItems().items,
            cols = me.getCols(),
            record = me.getRecord();
        me.initFields(items,cols);

        //混入字段在updateRecord调用setValues方法时还没初始化，
        //因而不会有初始值，必须在这里重新执行一次setValues
        me.setValues(record.data);

        //使用该方便避免调用callParent的麻烦
        me.onAfterInitForm && me.onAfterInitForm(items, record);
    },

    initFields(items, cols){
        let me = this,
            autoLabelAlign = me.autoLabelAlign,
            labelWidth = me.getLabelWidth(),            
            labelAlign = Ext.platformTags.desktop ? 'left' : 'top';
        if (cols <= 0 || Ext.platformTags.phone) cols = 1;
        Ext.each(items, item => {
            let cls = item.getUserCls();
            !cls.includes('cols-') && item.setUserCls(`${cls} cols-${cols}`);
            item.getLangLabel() && item.setLabelWidth(labelWidth);
            autoLabelAlign && item.setLabelAlign(labelAlign)
        })
    },

    setValues(values) {
        let me = this,
            fields = me.getFields(),
            name, field, value, ln, i, f;

        values = values || {};

        for (name in values) {
            if (values.hasOwnProperty(name)) {
                field = fields[name];
                value = values[name];

                if (field) {
                    // If there are multiple fields with the same name. Checkboxes, radio
                    // fields and maybe event just normal fields..
                    if (Ext.isArray(field)) {
                        ln = field.length;

                        // Loop through each of the fields
                        for (i = 0; i < ln; i++) {
                            f = field[i];

                            if (f.isRadio) {
                                // If it is a radio field just use setGroupValue which
                                // will handle all of the radio fields
                                f.setGroupValue(value);
                                break;
                            }
                            else if (f.isCheckbox) {
                                if (Ext.isArray(value)) {
                                    f.setChecked(value.indexOf(f._value) !== -1);
                                }
                                else {
                                    f.setChecked(value === f._value);
                                }
                            }
                            else {
                                // If it is a bunch of fields with the same name, check
                                // if the value is also an array, so we can map it to
                                // each field
                                if (Ext.isArray(value)) {
                                    f.setValue(value[i]);
                                }
                            }
                        }
                    }
                    else {
                        if (field.isRadio || field.isCheckbox) {
                            // If the field is a radio or a checkbox
                            field.setChecked(value);
                        }
                        else {
                            // If just a normal field
                            field.setValue(value);
                        }
                    }

                    if (me.getTrackResetOnLoad && me.getTrackResetOnLoad()) {
                        if (Ext.isArray(field)) {
                            field.forEach(f => {
                                f.resetOriginalValue();
                            });
                        } else {
                            field.resetOriginalValue();
                        }
                    }
                }
            }
        }

        return me;
    }

})
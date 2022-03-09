Ext.define('Common.shared.ux.form.Panel',{
    extend: 'Ext.form.Panel',

    requires:[
        'Ext.Responsive',
        'Ext.field.Hidden',
        'Ext.field.Password',
        'Ext.field.Text',
        'Ext.field.ComboBox',
        'Ext.field.Checkbox',
        'Ext.field.Radio',
        'Ext.field.Hidden',
        'Ext.field.Email',
        'Ext.field.Number',
        'Ext.field.Container',
        'Common.shared.ux.form.BaseController',
        'Common.shared.ux.panel.Header',
        'Common.shared.ux.button.Success',
        'Common.shared.ux.button.Error',
    ],

    trackResetOnLoad: true,
    defaultType: 'textfield',
    layout: 'vbox',
    includeResource: true,  

    // config:{
    //     entityName: null,
    //     resourceName: null,
    // },


    setValues: function(values) {
        var fields = this.getFields(),
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
 
                    if (this.getTrackResetOnLoad && this.getTrackResetOnLoad()) {
                        if(Ext.isArray(field)){
                            field.forEach(f=>{
                                f.resetOriginalValue();
                            });
                        }else{
                            field.resetOriginalValue();
                        }
                    }
                }
            }
        }
 
        return this;
    },


})
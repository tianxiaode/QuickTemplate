Ext.define('Common.ux.form.Base',{
    extend: 'Ext.form.Panel',
    xtype: 'uxformpanel',

    requires:[
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

    mixins:[
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
    
    config:{
        cols: 1,
        labelWidth: 120
    },

    defaults:{
        errorTarget: 'under',
        userCls: 'mx-1'
    },

    updateCols(cols){
        let me = this;
        if(!me.isReady) return;
        if(cols <= 0 || Ext.platformTags.phone) cols = 1;        
        let dialog = me.up('[isDialog]'),
            labelWidth = me.getLabelWidth(),
            items = me.getItems().items;
        Ext.each(items, item=>{
            let cls = item.getUserCls();
            if(!cls.includes('cols-')){
                item.setUserCls(`${cls} cols-${cols}`);
            }
            Logger.debug(this.updateCols, item.name)
            if(item.getLangLabel()){
                item.setLabelWidth(labelWidth);
            }
        })
        if(!dialog) return;
        dialog.setWidth(Ext.platformTags.desktop ? 400*cols : '100%');
    },

    initialize(){
        let me = this;
        me.isReady = true;
        me.updateCols(me.getCols());
        me.callParent();
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
 
        return me;
    }

})
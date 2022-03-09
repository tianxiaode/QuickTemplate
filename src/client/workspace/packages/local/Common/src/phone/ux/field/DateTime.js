Ext.define('Common.phone.ux.field.DateTime', {
    extend: 'Ext.field.Text',
    xtype: 'commonphone-datetimefield',

    requires: [
        //'Common.shared.ux.panel.DateTime',
        //'Common.shared.ux.field.trigger.DateTime',
        'Ext.field.trigger.Date',
        'Common.phone.ux.panel.DateTime',
    ],

    config:{
        minDate: null,
        maxDate: null,
        hasTime: true,        
    },

    
    // triggers: {
    //     date: {
    //         type: 'date'
    //     }
    // },    

    getDateFormat(){
        return this.getHasTime() ? Format.defaultDateTimeFormat : Format.defaultDateFormat;
    },

    //editable: false,
    //readOnly: true,

    applyValue(value){
        let me = this;
        if(!value) return value;
        //me.callParent(arguments);
        if(Ext.isString(value)){
            value = Ext.Date.parse(value, me.getDateFormat());
        }
        return value;
    },

    updateValue(value){
        let me = this;
        //me.callParent(arguments);
        if(Ext.isDate(value)) me.inputElement.set({value : Format.date(value, me.getDateFormat())});
    },

    updateHasTime(value){
        var me = this,
            triggerType = value ?  'datetime': 'date';
        me.setTriggers({
            expand: {
                type: triggerType,
                handler: me.onExpandTap
            }    
        })
    },

    initialize() {
        var me = this;
        me.callParent();
        me.inputElement.on('tap', 'onInputElementClick', me);
    },

    onInputElementClick(e) {
        this.onExpandTap();
    },

    onExpandTap(){
        var me = this,
            now = new Date(),
            minValue = me.getMinDate() || Ext.Date.add(now ,  Ext.Date.YEAR, -10),
            maxValue = me.getMaxDate() || Ext.Date.add(now, Ext.Date.YEAR,10),
            dlg= ViewMgr.get('commonphone-datetimepanel'),
            value = me.getValue() || new Date();
        dlg.on('change', me.onDateTimeChange, me);
        dlg.setHasTime(me.getHasTime());
        dlg.setMinDate(minValue);
        dlg.setMaxDate(maxValue);
        dlg.setTitle(me.getLabel() || me.getPlaceholder());
        dlg.setFieldId(me.id);
        dlg.setValue(value);
        dlg.show();
    },

    onDateTimeChange(sender, value, fieldId){
        let me= this;
        if(fieldId !== me.id) return;
        me.setValue(value);
        //me.inputElement.setValue(Format.date(value, me.getDateFormat()));
    }

});
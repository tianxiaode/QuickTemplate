Ext.define('Common.overrides.shared.field.Date',{
    override: 'Ext.field.Date',

    onLocalized(){
        let me = this;
        me.minDateMessage = I18N.get('MinDateMessage');
        me.maxDateMessage = I18N.get('MaxDateMessage');
        me.setDateFormat(Ext.util.Format.defaultDateFormat);
        me.callParent();
    }

})
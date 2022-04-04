Ext.define('Common.overrides.shared.field.Number',{
    override: 'Ext.field.Number',

    onLocalized(){
        let me = this;
        me.decimalsText = I18N.get('DecimalsText');
        me.minValueText = I18N.get('MinValueText');
        me.maxValueText = I18N.get('MaxValueText');
        me.callParent();
    }

})
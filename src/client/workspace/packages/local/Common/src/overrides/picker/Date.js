Ext.define('Common.overrides.picker.Date', {
    override: 'Ext.picker.Date',

    onLocalized(){
        let me = this;
        me.setMonthText(I18N.get('Month'));
        me.setDayText(I18N.get('Day'))
        me.setYearText(I18N.get('Year'))
    },

});

Ext.define('Common.overrides.shared.picker.Date', {
    override: 'Ext.picker.Date',

    onLocalized(){
        const me = this;
        me.setMonthText(I18N.get('Month'));
        me.setDayText(I18N.get('Day'))
        me.setYearText(I18N.get('Year'))
    },

});

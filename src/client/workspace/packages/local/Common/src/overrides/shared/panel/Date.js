Ext.define('Common.overrides.shared.panel.Date', {
    override: 'Ext.panel.Date',


    onLocalized(){
        let me = this;
        me.setNextText(I18N.get('NextText'));
        me.setPrevText(I18N.get('PrevText'));
    },

});

Ext.define('Common.overrides.shared.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    onLocalized(){
        const me = this;
        me.setLoadingText(I18N.get('LoadingText'))
    }

});

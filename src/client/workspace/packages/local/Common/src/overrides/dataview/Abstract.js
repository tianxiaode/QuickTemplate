Ext.define('Common.overrides.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    onLocalized(){
        let me = this;
        me.setLoadingText(I18N.get('LoadingText'))
    },

    applyItemTpl(config) {
        return Template.getTplWithScope(config, this);
    },

});

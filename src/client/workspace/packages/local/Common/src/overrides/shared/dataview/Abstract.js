Ext.define('Common.overrides.shared.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    onLocalized(){
        let me = this;
        me.setLoadingText(I18N.get('LoadingText'))
    },

    applyItemTpl(config) {
        return Template.getTplWithScope(config, this);
    },

});

Ext.define('Common.overrides.shared.data.validator.Range',{
    override: 'Ext.data.validator.Range',

    langMinOnlyMessage: 'Must be at least {0}',
    langMaxOnlyMessage: 'Must be no more than than {0}',
    langBothMessage: 'Must be between {0} and {1}',

    config: {
        langNanMessage: 'Must be numeric'
    },

    onLocalized(){
        const me = this;
        me.setNanMessage(I18N.get(me.getLangNanMessage()))
        me.callParent();
    },

})

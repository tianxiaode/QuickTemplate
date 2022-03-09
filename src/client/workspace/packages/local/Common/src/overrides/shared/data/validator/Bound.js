Ext.define('Common.overrides.shared.data.validator.Bound',{
    override: 'Ext.data.validator.Bound',

    config:{
        langEmptyMessage: 'Must be present',
        langMinOnlyMessage: 'Value must be greater than {0}',
        langMaxOnlyMessage: 'Value must be less than {0}',
        langBothMessage: 'Value must be between {0} and {1}'
    },

    onLocalized(){
        let me = this;
        me.setEmptyMessage(I18N.get(me.getLangEmptyMessage()))
        me.setMinOnlyMessage(I18N.get(me.getLangMinOnlyMessage()))
        me.setMaxOnlyMessage(I18N.get(me.getLangMaxOnlyMessage()))
        me.setBothMessage(I18N.get(me.getBothMessage()))
        me.callParent();
    },


})

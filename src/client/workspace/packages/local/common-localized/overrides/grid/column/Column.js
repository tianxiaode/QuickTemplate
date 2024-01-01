Ext.define('Common.overrides.grid.column.Column',{
    override: 'Ext.grid.column.Column',

    config:{
        autoText: true,
        langText: null,
        groupable: false,
    },

    onLocalized(){
        let me = this,
            store = me.getGrid().getStore(),
            langTextFields = store.langTextFields,
            dataIndex = me.getDataIndex(),
            resourceName = store.getResourceName(),
            entityName = store.getEntityName();
        if(me.getAutoText()){
            name = Ext.util.Format.capitalize( langTextFields.get(dataIndex) || dataIndex);
            me.setLangText(name);
        }
        let text = me.getLocalizedText(me.getLangText(), resourceName, entityName);
        text && me.setText(text);
    }

    // applyTpl(config) {
    //     return Template.getTplWithScope(config, this);
    // },


})
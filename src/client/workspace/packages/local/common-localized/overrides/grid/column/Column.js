Ext.define('Common.overrides.grid.column.Column',{
    override: 'Ext.grid.column.Column',

    config:{
        autoText: true,
        langText: null,
        groupable: false,
        entityName: null
    },

    onLocalized(){
        let me = this,
            grid = me.getGrid(),
            store = grid && grid.getStore();

        if(!store) return;
        me.setResourceName(store.getResourceName());
        me.setEntityName(store.getEntityName());

        let langTextFields = store.langTextFields,
            dataIndex = me.getDataIndex();
        if(me.getAutoText()){
            let name = Ext.util.Format.capitalize( langTextFields.get(dataIndex) || dataIndex);
            me.setLangText(name);
        }
        let text = me.getLocalizedText(me.getLangText());
        text && me.setText(text);
    }

})
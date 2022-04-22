Ext.define('Common.overrides.shared.grid.column.Column',{
    override: 'Ext.grid.column.Column',

    config:{
        autoText: true,
        langText: null,
        groupable: false,
    },

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName(),
            entityName = me.getEntityName();
        if(me.getAutoText()){
            let name = Ext.util.Format.capitalize(me.getDataIndex());
            me.setLangText(name);
        }
        let text = me.getLocalizedText(me.getLangText(), resourceName, entityName);
        text && me.setText(text);
    },

    applyTpl(config) {
        return Template.getTplWithScope(config, this);
    },

    isSortable() {
        var me = this,
            grid = me.getGrid(),
            store = grid.store,
            sortFields = store.sortFields,
            dataIndex = me.getDataIndex();
        return me.isLeafHeader &&
            (sortFields && sortFields[dataIndex]) &&
            me.getSortable() &&
            (me.pickSorter() || dataIndex) &&
            me.getRootHeaderCt().getSortable() &&
            grid.sortableColumns !== false;
    },


})
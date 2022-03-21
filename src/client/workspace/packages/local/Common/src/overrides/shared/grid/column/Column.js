Ext.define('Common.overrides.shared.grid.column.Column',{
    override: 'Ext.grid.column.Column',

    config:{
        autoText: true,
        langText: null,
        groupable: false,
    },

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName();
        if(me.getAutoText()){
            let name = Ext.util.Format.capitalize(me.getDataIndex());
            me.setLangText(name);
        }

        let text = me.getLocalizedText(me.getLangText(), resourceName);
        text && me.setText(text);
    },

    applyTpl(config) {
        return Template.getTplWithScope(config, this);
    },


})
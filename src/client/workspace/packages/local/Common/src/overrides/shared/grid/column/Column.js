Ext.define('Common.overrides.shared.grid.column.Column',{
    override: 'Ext.grid.column.Column',

    config:{
        autoText: true,
        langText: null,
        groupable: false,
    },

    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName();
        if(me.getAutoText()){
            let name = Ext.util.Format.capitalize(me.getDataIndex());
            me.setLangText(name);
        }
        let text = me.getLangText();
        if(text){
            me.setText(I18N.get(text, resourceName, me.getEntityName() ));
        }
    },

    applyTpl(config) {
        return Template.getTplWithScope(config, this);
    },


})
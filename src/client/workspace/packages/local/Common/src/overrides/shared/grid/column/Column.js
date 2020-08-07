Ext.define('Common.overrides.shared.grid.column.Column',{
    override: 'Ext.grid.column.Column',

    config:{
        autoText: true,
        langText: null

    },

    onLocalized(){
        const me = this,
            grid = me.up('grid'),
            resourceName = me.getResourceName() 
                || (grid && grid.getResourceName());
        if(me.getAutoText()){
            const name = Ext.util.Format.capitalize(me.getDataIndex());
            me.setLangText(name);
        }
        const text = me.getLangText();
        if(text){
            me.setText(I18N.get(text, resourceName));
        }
    }

})
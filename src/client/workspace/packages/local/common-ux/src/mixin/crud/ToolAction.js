Ext.define('Common.mixin.crud.ToolAction', {
    extend: 'Ext.Mixin',

    isToolAction: true,

    onTranslationToolTap(grid, context){
        Logger.debug(this.onTranslationToolTap, context);
    },

    onUpdateToolTap(grid, context){
        Logger.debug(this.onUpdateToolTap, context);
    },

    onDeleteToolTap(grid, context){
        Logger.debug(this.onDeleteToolTap, context);
    }
});
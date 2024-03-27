Ext.define('Common.mixin.crud.ToolAction', {
    extend: 'Ext.Mixin',

    onMultilingualToolTap(grid, context){
        this.currentRecord = context.record;
        this.onMultilingual && this.onMultilingual();
    },

    onDeleteToolTap(grid, context){
        this.currentRecord = context.record;
        this.onTrashButtonTap(true);
    },
    

    onUpdateToolTap(grid, context){
        this.currentRecord = context.record;
        this.onUpdateButtonTap();
    }


});
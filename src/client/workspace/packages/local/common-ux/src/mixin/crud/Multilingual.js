Ext.define('Common.mixin.crud.Multilingual',{
    extend: 'Ext.Mixin',

    onMultilingual(grid, info){
        this.doMultilingual(info.record);
    },

    doMultilingual(record){
        this.onShowView(`multilingual`, record);
    }
})

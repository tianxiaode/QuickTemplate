Ext.define('Common.ux.crud.controller.mixin.Multilingual',{
    extend: 'Ext.Mixin',

    onMultilingual(grid, info){
        this.onShowView('multilingual', info.record);
    },
})

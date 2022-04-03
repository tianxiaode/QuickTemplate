Ext.define('Common.ux.crud.controller.mixin.ChildLongPress',{
    extend: 'Common.ux.crud.controller.mixin.Base',

    detailViewXtype: null,

    initList(){
        let me = this,
            list = me.list;
        list.childLongPress && list.on('childlongpress', me.onListChildLongPress, me);
    },

    onListChildLongPress(){}

})
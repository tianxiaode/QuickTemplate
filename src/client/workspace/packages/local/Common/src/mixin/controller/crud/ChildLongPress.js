Ext.define('Common.mixin.controller.crud.ChildLongPress',{
    extend: 'Common.mixin.controller.crud.Base',

    detailViewXtype: null,

    initList(){
        let me = this,
            list = me.list;
        list.childLongPress && list.on('childlongpress', me.onListChildLongPress, me);
    },

    onListChildLongPress(){}

})
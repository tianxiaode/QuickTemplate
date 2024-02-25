Ext.define('Common.mixin.crud.ChildLongPress',{
    extend: 'Common.mixin.crud.Base',

    detailViewXtype: null,

    initList(){
        let me = this,
            list = me.list;
        list.childLongPress && list.on('childlongpress', me.onListChildLongPress, me);
    },

    onListChildLongPress(){}

})
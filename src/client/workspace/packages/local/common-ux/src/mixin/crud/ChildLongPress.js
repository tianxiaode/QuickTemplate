Ext.define('Common.mixin.crud.ChildLongPress',{
    extend: 'Common.mixin.Base',

    config:{
        childLongPress: false
    },

    childLongPressListener: null,

    updateChildLongPress(value){
        let me = this,
            list = me.getList() || me;
        if(value){
            me.childLongPressListener = list.on({
                childlongpress: me.onListChildLongPress,
                scope: me,
                destroyable: true
            })
        }else{
            Ext.destroy(me.childLongPressListener);
        }
    },

    onListChildLongPress(sender){},

    doDestroy() {
        Ext.destroy(this.childLongPressListener);
    }

})
Ext.define('Common.mixin.crud.DoubleTapToEdit',{
    extend: 'Common.mixin.Base',

    config:{
        doubleTapToEdit: false,
    },

    doubleTapToEditListener: null,

    updateDoubleTapToEdit(value){
        let me = this,
            list = me.getList() || me;
        if(value){
            me.doubleTapToEditListener = list.on({
                childdoubletap: me.onChildDoubleTap,
                scope: me,
                destroyable: true
            })
        }else{
            Ext.destroy(me.doubleTapToEditListener);
        }
    },

    onChildDoubleTap(sender, location, eOpts){
        this.doUpdate(location.record);
    },

    doDestroy() {
        Ext.destroy(this.doubleTapToEditListener);
    }


})
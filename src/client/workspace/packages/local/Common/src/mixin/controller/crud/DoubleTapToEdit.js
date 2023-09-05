Ext.define('Common.mixin.controller.crud.DoubleTapToEdit',{
    extend: 'Common.mixin.controller.crud.Base',

    initList(){
        let me = this,
            list = me.list;
        list.doubleTapToEdit && list.on('childdoubletap', me.onChildDoubleTap, me);
    },

    onChildDoubleTap(sender, location, eOpts){
        this.doUpdate(location.record);
    }

})
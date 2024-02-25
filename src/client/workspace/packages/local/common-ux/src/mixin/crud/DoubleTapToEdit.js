Ext.define('Common.mixin.crud.DoubleTapToEdit',{
    extend: 'Common.mixin.crud.Base',

    initList(){
        let me = this,
            list = me.list;
        list.doubleTapToEdit && list.on('childdoubletap', me.onChildDoubleTap, me);
    },

    onChildDoubleTap(sender, location, eOpts){
        this.doUpdate(location.record);
    }

})
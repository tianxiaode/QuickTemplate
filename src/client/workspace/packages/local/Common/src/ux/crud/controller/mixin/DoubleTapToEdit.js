Ext.define('Common.ux.crud.controller.mixin.DoubleTapToEdit',{
    extend: 'Common.ux.crud.controller.mixin.Base',

    initList(){
        let me = this,
            list = me.list;
        list.doubleTapToEdit && list.on('childdoubletap', me.onChildDoubleTap, me);
    },

    onChildDoubleTap(){
        let me = this,
            updateButton = me.getCrudButton('update');
        if(updateButton.getDisabled()) return;
        me.onUpdate();
    },

})
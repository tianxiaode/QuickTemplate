Ext.define('Common.ux.crud.controller.Phone',{
    extend: 'Common.ux.crud.controller.Base',
    alias: 'controller.uxcrudphonecontroller',

    onBack(){
        let me = this,
            backView = me.backView || Ext.route.Router.application.getDefaultToken();
        me.redirectTo(backView);
    },

    onDone(){},

    onSort(sender){
        let me = this,
            value = sender.getValue();
        if(me.currentSortField === value) return;
        me.currentSortField = value;
        let index =  value.indexOf('-'),
            field = value.substr(0,index),
            dir = value.substr(index+1),
            store = me.currentList.getStore();
        store.sort(field, dir);
    },


});

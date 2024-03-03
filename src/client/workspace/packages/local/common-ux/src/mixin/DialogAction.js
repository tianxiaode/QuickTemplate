Ext.define('Common.mixin.DialogAction', {
    extend: 'Ext.Mixin',

    getDialog(){
        let me = this;
        return me.isViewController ? me.getView() : me;
    },

    onOk(){},

    onSaveAndNew(){},

    onCancel(){
        Ext.defer(this.getDialog().close, 2000, this);
    }
})
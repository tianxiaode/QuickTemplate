Ext.define('Common.mixin.DialogAction', {
    extend: 'Ext.Mixin',

    getDialog(){
        let me = this;
        return me.isViewController ? me.getView() : me;
    },    

    onSaveAndNewButtonTap(){},

    onSaveButtonTap(){},

    onCancelButtonTap(){
        this.getDialog().close();
    },

    onResetButtonTap(){
        this.onReset();
    },

    onReset(){
        let me = this,
            form = me.getForm();
        me.getToolbar().getMessageButton().setHidden(true);
        if(form){
            form.reset();
            form.clearErrors();
            form.initFocus();    
        }
    }

})
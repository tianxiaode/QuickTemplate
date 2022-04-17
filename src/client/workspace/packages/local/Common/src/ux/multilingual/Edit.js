Ext.define('Common.ux.multilingual.Edit',{
    extend: 'Common.ux.form.OneInput',
    xtype: 'uxmultilingualedit',

    hasTextarea: true,
    callback: null,

    onSave(){
        this.onSubmitSuccess();
    },


    onSubmitSuccess(response){
        let me = this;
        me.callback && me.callback.apply(null, [me.field, me.getInputValue()]);
        me.onCancel()
    },

    doDestroy(){        
        this.callback = false;
        this.callParent(arguments);
    },

    onCancel(){
        this.callback = null;
        this.hide();
    }

})
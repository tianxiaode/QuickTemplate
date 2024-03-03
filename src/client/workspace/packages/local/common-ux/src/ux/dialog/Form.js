Ext.define('Common.ux.dialog.Form',{
    extend: 'Common.ux.dialog.Base',
    xtype: 'uxformdialog',

    mixins:[
        'Common.mixin.Form'
    ],

    weighted: true,

    config:{
        toolbar: { 
            xtype: 'uxdialogtoolbar',
            docked: 'bottom',
            saveButton:{ weight: 400},
            saveAndNewButton: { weight: 300},
            messageButton: { weight: 100}
        },
        form: {weight: 100, },
    },

    onOk(){
        this.getToolbar().showMessage('错误',  true);
    },

    onSaveAndNew(){
        Logger.debug(this.onSaveAndNew, this.getToolbar(),  this.getToolbar().getMessageButton())
        this.getToolbar().showMessage('正确',  false);
    },

    



})
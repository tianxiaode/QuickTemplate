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
            messageButton: { weight: 100, hidden: true},
            resetButton: { weight: 200 },
            saveAndNewButton: { weight: 300},
            saveButton:{ weight: 400},
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
Ext.define('Common.ux.form.Crud',{
    extend: 'Common.ux.form.Base',

    controller: 'shared-crudformcontroller',

    requires:[
        'Common.ux.button.Reset'
    ],

    hasSaveAndNewButton: true,
    hasResetButton: true,

    minWidth: 600,

    getPhoneDefaultButtons(){
        let me = this;
        return {
            done: {
                handler: 'onSave'
            },
            saveAndNew : {
                handler: 'onSaveAndNew',
                langText: null,
                langTooltip: null,
                hidden: !me.hasSaveAndNewButton
            },
            reset: {
                handler: 'onReset',
                langText: null,
                langTooltip: null,
                hidden: !me.hasResetButton,
            },
            message: {
                xtype: 'uxmessagebutton',
            },
        }
    },

    getDesktopDefaultButtons(){
        let me = this;
        return {
            message: true,
            fill: true,
            saveAndNew : {
                handler: 'onSaveAndNew',
                hidden: !me.hasSaveAndNewButton
            },
            save: {
                handler: 'onSave'
            },
            reset: {
                handler: 'onReset',
                hidden: !me.hasResetButton
            },
            cancel: {
                handler: 'onCancel',
                weight: 100
            }
        }
    },


})
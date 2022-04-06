Ext.define('Common.view.identity.users.EditController',{
    extend: 'Common.ux.crud.form.FormController',
    alias: 'controller.usereditcontroller',

    afterAddRecord(){
        this.updateFieldState(false);
    },

    afterEditRecord(){
        this.updateFieldState(true);
    },

    updateFieldState(isEdit){
        let me = this,
            view = me.getView();
        view.lookup('userNameField').setDisabled(isEdit);
        view.getNewPassword().setRequired(!isEdit);
        view.getConfirmPassword().setRequired(!isEdit);
        view.clearErrors();
    }
})
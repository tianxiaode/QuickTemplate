Ext.define('Common.mixin.Messageable', {
    extend: 'Ext.Mixin',

    getMessageButton(){
        let me = this,
            view  = me.isViewController ? me.getView() : me,
            button = view.getMessageButton();
        return button;
    },

    showMessage(msg, isError){
        let me = this,
            button = me.getMessageButton(),
            tooltip = button.getTooltip();
        button.setError(isError);
        button.setMessage(msg);
        button.setHidden(false);
        tooltip.show();
        Ext.defer(tooltip.hide, 2000, tooltip);
    },

});
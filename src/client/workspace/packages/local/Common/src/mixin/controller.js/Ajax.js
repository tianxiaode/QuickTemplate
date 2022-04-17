Ext.define('Common.mixin.controller.Ajax',{
    extend: 'Ext.Mixin',

    onAjaxFailure(response){    
        let error = Http.getError(response, this.resourceName);
        MsgBox.alert(null,error);
    },
})

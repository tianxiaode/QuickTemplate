Ext.define('Common.mixin.AjaxFailure',{
    extend: 'Ext.Mixin',

    onAjaxFailure(response){    
        let error = Http.getError(response, this.resourceName);
        MsgBox.alert(null,error);
    },
})

Ext.define('Common.overrides.MessageBox',{
    override: 'Ext.MessageBox',    

    showAjaxErrors(title, response){
        let error = response.request.getError(),
            message = `<h5 class="m-0 p-2">${error.message}</h5>`;
        if(error.details){
            message += `<p class="m-0 p-2">${error.details}</p>`;
        }
        if(error.validationErrors){
            let tpl = Template.getTpl('messageList');
            Object.keys(error.validationErrors).forEach(k=>{
                let errors = error.validationErrors[k];
                message += `<p class="m-0 p02">${k}: ${tpl.apply(errors)}</p>`;
            })
        }
        Ext.Msg.alert(title, message);
    }
}, function(MessageBox) {
    Ext.onInternalReady(function() {
        Ext.Msg.showAjaxErrors = Ext.MessageBox.prototype.showAjaxErrors;
    })
})
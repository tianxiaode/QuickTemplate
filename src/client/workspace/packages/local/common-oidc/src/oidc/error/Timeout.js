Ext.define('Common.oidc.error.Timeout', {

    statics:{
        create(message){
            let error = new Error(message);
            error.name = 'ErrorTimeout';
            return error;
        }
    }
},()=>{
    window.Oidc = window.Oidc || {};
    Oidc.ErrorTimeout = Common.oidc.error.Timeout;

})
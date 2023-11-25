Ext.define('Common.oidc.error.Response', {

    statics:{
        create(config){
            if(!config.error){
                Logger.error(this.create, "No error passed");
                throw new Error('No error passed')
            }
            let error = new Error(config.errorDescription || config.error || '');
            Ext.apply(error, config);
            error.state = config.userState;
            error.name = 'ErrorResponse';
            return error;
        }
    }
},()=>{
    window.Oidc = window.Oidc || {};
    Oidc.ErrorResponse = Common.oidc.error.Response;

})
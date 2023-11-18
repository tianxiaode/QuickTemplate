Ext.define('Common.oidc.TokenClient',{
    alias: 'oidc.tokenclient',

    requires:[
        'Common.oidc.JsonService',
    ],

    jsonService: null,

    grantType: null,
    redirectUri: null,
    clientId: null,
    clientSecret: null,
    clientAuthentication: null,

    constructor(config){
        let me = this;
        me.jsonService = Ext.create('oidc.jsonservice',{ additionalContentTypes: config.additionalContentTypes, extraHeaders: config.extraHeaders });
        me.grantType = config.grantType; 
        me.redirectUri = config.redirectUri;
        me.clientId = config.clientId;
        me.clientSecret = config.clientSecret;
        me.clientAuthentication = config.clientAuthentication;

    },

    async exchangeCode(options){
        let me = this;
        options = options || {};
        grantType = options.grantType || me.grantType;
        redirectUri = options.redirectUri || me.redirectUri;
        clientId = options.clientId || me.clientId;
        clientSecret = options.clientSecret || me.clientSecret;
        if (!clientId) {
            throw new Error("A client_id is required");
        }
        if (!redirectUri) {
            throw new Error("A redirect_uri is required");
        }
        if (!options.code) {
            throw new Error("A code is required");
        }
        delete options.grantType;
        delete options.redirectUri;
        delete options.clientId;
        delete options.clientSecret;

        let params = new URLSearchParams({ grantType, redirectUri });
        for (let [key, value] of Object.entries(args)) {
            if (value != null) {
                params.set(key, value);
            }
        }
        let basicAuth;
        switch (me.clientAuthentication) {
            case "client_secret_basic":
                if (!client_secret) {
                    throw new Error("A client_secret is required");
                }
                basicAuth = Oidc.Crypto.generateBasicAuth(clientId, clientSecret);
                break;
            case "client_secret_post":
                params.append("client_id", clientId);
                if (clientSecret) {
                    params.append("client_secret", clientSecret);
                }
                break;
        }

        let url = await this._metadataService.getTokenEndpoint(false);
        logger.debug("got token endpoint");

        const response = await this._jsonService.postForm(url, { body: params, basicAuth, initCredentials: this._settings.fetchRequestCredentials });
        logger.debug("got response");

        return response;

    },

    destroy() {
        this.destroyMembers('jsonService');
        this.callParent();
    }

});

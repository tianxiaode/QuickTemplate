Ext.define('Common.service.oauth.Metadata',{

    requires: [
        'Common.service.HttpClient'
    ],

    constructor(config) {
        let me = this;
        me.settings = config;

        me.metadataUrl = config.metadataUrl;
        if (config.signingKeys) {
            Ext.debug("using signingKeys from settings");
            me.signingKeys = config.signingKeys;
        }

        if (config.metadata) {
            Ext.debug("using metadata from settings");
            me.metadata = config.metadata;
        }

        if (config.fetchRequestCredentials) {
            Ext.debug("using fetchRequestCredentials from settings");
            me.fetchRequestCredentials = config.fetchRequestCredentials;
        }

    },

    resetSigningKeys(){
        this.signingKeys = null;
    },

    async getMetadata(){
        let me = this;
        if (me.metadata) {
            Ext.debug("using cached values");
            return me.metadata;
        }

        if (!me.metadataUrl) {
            Ext.raise("No authority or metadataUrl configured on settings");
        }

        Ext.debug("getting metadata from ", me._metadataUrl);
        let response = await Http.get(me.metadataUrl, { credentials: me.fetchRequestCredentials });
        metadata = response.jsonData;

        Ext.debug("merging remote JSON with seed metadata");
        me.metadata = Object.assign({}, me.settings.metadataSeed, metadata);
        return me.metadata;
    },

    getIssuer(){
        return this.getMetadataProperty("issuer");
    },

    getAuthorizationEndpoint(){
        return this.getMetadataProperty("authorization_endpoint");
    },

    getUserInfoEndpoint(){
        return this.getMetadataProperty("userinfo_endpoint");
    },

    getTokenEndpoint(optional){
        return this.getMetadataProperty("token_endpoint", optional);
    },

    getCheckSessionIframe(){
        return this.getMetadataProperty("check_session_iframe", true);
    },

    getEndSessionEndpoint(){
        return this.getMetadataProperty("end_session_endpoint", true);
    },

    getRevocationEndpoint(optional){
        return this.getMetadataProperty("revocation_endpoint", optional);
    },

    getKeysEndpoint(optional){
        return this.getMetadataProperty("jwks_uri", optional);
    },    

    async getSigningKeys(){
        let me = this;
        if (me.signingKeys) {
            Ext.debug("returning signingKeys from cache");
            return me.signingKeys;
        }

        let jwks_uri = await this.getKeysEndpoint(false);
        Ext.debug("got jwks_uri", jwks_uri);

        let response = await this._jsonService.getJson(jwks_uri),
            keySet = response.jsonData;
        Ext.debug("got key set", keySet);

        if (!Array.isArray(keySet.keys)) {
            Ext.raise("Missing keys on keyset");
            // https://github.com/microsoft/TypeScript/issues/46972
        }

        me.signingKeys = keySet.keys;
        return me.signingKeys;
    },

    destroy() {
        this.destroyMembers('settings','signingKeys', 'metadata');
        this.callParent();
    },

    privates:{
        async getMetadataProperty(name, optional){

            let response = await me.getMetadata(),
                metadata = response.jsonData;
            Ext.debug("resolved");
    
            if (metadata[name] === undefined) {
                if (optional === true) {
                    Ext.warn("Metadata does not contain optional property");
                    return undefined;
                }
    
                Ext.raise("Metadata does not contain property ");
            }
    
            return metadata[name];
        }            
    }, //end privates




})
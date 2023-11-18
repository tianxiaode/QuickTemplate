Ext.define('Common.oidc.MetadataService',{
    alias: 'oidc.metadataservice',

    requires:[
        'Common.oidc.JsonService',
    ],

    metadataUrl: null,
    signingKeys: null,
    metadata: null,
    fetchRequestCredentials: null,
    jsonService: null,
    metadataSeed: null,

    constructor(config){
        let me = this;
        me.metadataUrl = config.metadataUrl;
        me.metadataSeed = config.metadataSeed;
        me.jsonService = Ext.create('oidc.jsonservice',{ additionalContentTypes: ["application/jwk-set+json"], extraHeaders: config.extraHeaders });

        if(config.signingKeys){
            Logger.debug(me, "using signingKeys from settings");
            me.signingKeys = config.signingKeys;
        }

        if (config.metadata) {
            Logger.debug(me, "using metadata from settings");
            me.metadata = config.metadata;
        }

        if (config.fetchRequestCredentials) {
            Logger.debug(me, "using fetchRequestCredentials from settings");
            me.fetchRequestCredentials = config.fetchRequestCredentials;
        }

    },

    resetSigningKeys(){
        this.signingKeys = null;
    },

    async getMetadata(){
        let me = this;
        if(me.metadata){
            Logger.debug(me, "using cached values");
            return me.metadata;
        }

        if (!me.metadataUrl) {
            throw new Error("No authority or metadataUrl configured on settings");
        }

        Logger.debug(me, "getting metadata from", me.metadataUrl);
        let metadata = await me.jsonService.getJson(me.metadataUrl, null, me.fetchRequestCredentials);

        Logger.debug(me, "merging remote JSON with seed metadata");
        me.metadata = Object.assign({}, me.metadataSeed, metadata);
        return me.metadata;
    },

    getIssuer() {
        return this.getMetadataProperty("issuer");
    },

    getAuthorizationEndpoint(){
        return this.getMetadataProperty("authorization_endpoint");
    },

    getUserInfoEndpoint() {
        return this.getMetadataProperty("userinfo_endpoint");
    },

    getTokenEndpoint(optional){
        if(optional === undefined) optional = true;
        return this.getMetadataProperty("token_endpoint", optional);
    },

    getCheckSessionIframe() {
        return this.getMetadataProperty("check_session_iframe", true);
    },

    getEndSessionEndpoint(){
        return this.getMetadataProperty("end_session_endpoint", true);
    },

    getRevocationEndpoint(optional){
        if(optional === undefined) optional = true;
      return this.getMetadataProperty("revocation_endpoint", optional);
    },

    getKeysEndpoint(optional = true){
        if(optional === undefined) optional = true;
        return this.getMetadataProperty("jwks_uri", optional);
    },

    async getSigningKeys(){
        let me = this;
        if (me.signingKeys) {
            Logger.debug(me, "returning signingKeys from cache");
            return me.signingKeys;
        }

        let jwksUri = await me.getKeysEndpoint(false);
        Logger.debug(me, "got jwks_uri", jwksUri);

        let keySet = await me.jsonService.getJson(jwksUri);
        Logger.debug(me, "got key set", keySet);

        if (!Array.isArray(keySet.keys)) {
            throw new Error("Missing keys on keyset");
        }

        me.signingKeys = keySet.keys;
        return me.signingKeys;
    },


    destroy() {
        this.destroyMembers('jsonService', 'metadataSeed');
        this.callParent();
    },

    privates:{
        async getMetadataProperty(name, optional){
    
            let me = this,
                metadata = await me.getMetadata();
            Logger.debug(me, 'getMetadataProperty', "resolved");
    
            if (metadata[name] === undefined) {
                if (optional === true) {
                    Logger.warn(me, "Metadata does not contain optional property");
                    return undefined;
                }
    
                throw new Error("Metadata does not contain property " + name);
            }
    
            return metadata[name];
        }
    
    }




})
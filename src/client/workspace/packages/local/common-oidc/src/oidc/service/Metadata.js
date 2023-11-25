Ext.define('Common.oidc.service.Metadata', {
    alias: 'oidc.service.metadata',

    requires: [
        'Common.oidc.service.Json',
        'Common.oidc.setting.Client'
    ],

    metadataUrl: null,
    signingKeys: null,
    metadata: null,
    fetchRequestCredentials: null,
    jsonService: null,
    metadataSeed: null,

    constructor(clientSettings) {
        let me = this,
            settings = clientSettings.isInstance ? clientSettings : Ext.create('oidc.setting.client', clientSettings);
        me.metadataUrl = settings.metadataUrl;
        me.metadataSeed = settings.metadataSeed;
        me.jsonService = Ext.create('oidc.service.json', ["application/jwk-set+json"], null, settings.extraHeaders);

        if (settings.signingKeys) {
            Logger.debug(me.constructor, "using signingKeys from settings");
            me.signingKeys = settings.signingKeys;
        }

        if (settings.metadata) {
            Logger.debug(me.constructor, "using metadata from settings");
            me.metadata = settings.metadata;
        }

        if (settings.fetchRequestCredentials) {
            Logger.debug(me.constructor, "using fetchRequestCredentials from settings");
            me.fetchRequestCredentials = settings.fetchRequestCredentials;
        }

    },

    resetSigningKeys() {
        this.signingKeys = null;
    },

    async getMetadata() {
        let me = this;
        if (me.metadata) {
            Logger.debug(me.getMetadata, "using cached values");
            return me.metadata;
        }

        if (!me.metadataUrl) {
            throw new Error("No authority or metadataUrl configured on settings");
        }

        Logger.debug(me.getMetadata, "getting metadata from", me.metadataUrl);
        let metadata = await me.jsonService.getJson(me.metadataUrl, null, me.fetchRequestCredentials);

        Logger.debug(me.getMetadata, "merging remote JSON with seed metadata");
        me.metadata = Object.assign({}, me.metadataSeed, metadata);
        return me.metadata;
    },

    getIssuer() {
        return this.getMetadataProperty("issuer");
    },

    getAuthorizationEndpoint() {
        return this.getMetadataProperty("authorizationEndpoint");
    },

    getUserInfoEndpoint() {
        return this.getMetadataProperty("userinfoEndpoint");
    },

    getTokenEndpoint(optional) {
        if (optional === undefined) optional = true;
        return this.getMetadataProperty("tokenEndpoint", optional);
    },

    getCheckSessionIframe() {
        return this.getMetadataProperty("checkSessionIframe", true);
    },

    getEndSessionEndpoint() {
        return this.getMetadataProperty("endSessionEndpoint", true);
    },

    getRevocationEndpoint(optional) {
        if (optional === undefined) optional = true;
        return this.getMetadataProperty("revocationEndpoint", optional);
    },

    getKeysEndpoint(optional = true) {
        if (optional === undefined) optional = true;
        return this.getMetadataProperty("jwksUri", optional);
    },

    async getSigningKeys() {
        let me = this;
        if (me.signingKeys) {
            Logger.debug(me.getSigningKeys, "returning signingKeys from cache");
            return me.signingKeys;
        }

        let jwksUri = await me.getKeysEndpoint(false);
        Logger.debug(me.getSigningKeys, "got jwks_uri", jwksUri);

        let keySet = await me.jsonService.getJson(jwksUri);
        Logger.debug(me.getSigningKeys, "got key set", keySet);

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

    privates: {
        async getMetadataProperty(name, optional) {

            let me = this,
                metadata = await me.getMetadata();
            Logger.debug(me.getMetadataProperty, 'getMetadataProperty', "resolved");

            if (metadata[name] === undefined) {
                if (optional === true) {
                    Logger.warn(me.getMetadataProperty, "Metadata does not contain optional property");
                    return undefined;
                }

                throw new Error("Metadata does not contain property " + name);
            }

            return metadata[name];
        }

    }




})
Ext.define('Common.oidc.UserInfoService', {
    alias: 'oidc.userinfoservice',

    requires: [
        'Common.core.util.Logger',
        'Common.core.service.HttpClient',
        'Common.oidc.JsonService',
        'Common.oidc.MetadataService',
        'Common.oidc.ClientSettingsStore',
        'Common.oidc.util.Jwt'
    ],

    constructor(config) {
        let me = this;
        me.settings = config.settings;
        me.metadataService = config.metadataService;
        me.jsonService = Ext.create('oidc.jsonservice', { extraHeaders: me.settings.extraHeaders, jwtHandler: me.getClaimsFromJwt })
    },

    async getClaims(token) {
        let me = this;
        if (!token) {
            throw new Error("No token passed");
        }

        let url = await me.metadataService.getUserInfoEndpoint();
        Logger.debug(me, "got userinfo url", url);    

        let claims = await me.jsonService.getJson(url, token, me.settings.fetchRequestCredentials);
        Logger.debug(me, "got claims", claims);

        return claims;

    },


    destroy() {
        this.destroyMembers('settings', 'metadataService', 'jsonService');
        this.callParent();
    },


    privates: {
        async getClaimsFromJwt(responseText) {
            try {
                let payload = Oidc.Jwt.decode(responseText);
                Logger.debug("JWT decoding successful");

                return payload;
            } catch (err) {
                Logger.error("Error parsing JWT response");
                throw err;
            }
        }
    }

});

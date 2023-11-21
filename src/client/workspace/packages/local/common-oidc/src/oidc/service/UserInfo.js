Ext.define('Common.oidc.service.UserInfo', {
    alias: 'oidc.service.userinfo',

    requires: [
        'Common.core.util.Logger',
        'Common.core.service.HttpClient',
        'Common.oidc.service.Json',
        'Common.oidc.service.Metadata',
        'Common.oidc.util.Jwt'
    ],

    constructor(clientSettings, metadataService) {
        let me = this, 
            settings;
        settings = me.settings = clientSettings.isInstance ? clientSettings : Ext.create('oidc.setting.client', clientSettings);
        me.metadataService = metadataService;
        me.jsonService = Ext.create('oidc.service.json', null, me.getClaimsFromJwt, settings.extraHeaders);
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

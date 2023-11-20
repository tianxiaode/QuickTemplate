Ext.define('Common.oidc.ClaimsService',{
    alias: 'oidc.claimsservice',

    requires:[
        'Common.oidc.JsonService',
    ],

    defaultProtocolClaims: [
        "nbf",
        "jti",
        "auth_time",
        "nonce",
        "acr",
        "amr",
        "azp",
        "at_hash", // https://openid.net/specs/openid-connect-core-1_0.html#CodeIDToken
    ],

    internalRequiredProtocolClaims: ["sub", "iss", "aud", "exp", "iat"],

    constructor(config){
        let me = this;
        me.settings = config.settings;
    },

    filterProtocolClaims(claims){
        let me = this,
            settings = me.settings,
            result = { ...claims };

        if (settings.filterProtocolClaims) {
            let protocolClaims;
            if (Array.isArray(settings.filterProtocolClaims)) {
                protocolClaims = settings.filterProtocolClaims;
            } else {
                protocolClaims = me.defaultProtocolClaims;
            }

            for (let claim of protocolClaims) {
                if (!me.internalRequiredProtocolClaims.includes(claim)) {
                    delete result[claim];
                }
            }
        }

        return result;
    },

    mergeClaims(claims1, claims2) {
        let me = this;
            settings = me.settings,
            result = { ...claims1 };

        if(settings.mergeClaims){
            return Ext.Object.merge(claims1, claims2);
        }

        for (let [claim, values] of Object.entries(claims2)) {
            for (let value of Array.isArray(values) ? values : [values]) {
                let previousValue = result[claim];
                if (!previousValue) {
                    result[claim] = value;
                }
                else if (Array.isArray(previousValue)) {
                    if (!previousValue.includes(value)) {
                        previousValue.push(value);
                    }
                }
                else if (result[claim] !== value) {
                    result[claim] = [previousValue, value];
                    // if (typeof value === "object" && settings.mergeClaims) {
                    //     console.log('re-setting-value',claim, previousValue, value)
                    //     result[claim] = Ext.Object.merge(previousValue , value);
                    // }
                    // else {
                    //     result[claim] = [previousValue, value];
                    // }
                }
            }
        }

        return result;
    },

    destroy() {
        this.destroyMembers('settings', 'defaultProtocolClaims', 'internalRequiredProtocolClaims');
        this.callParent();
    }

});

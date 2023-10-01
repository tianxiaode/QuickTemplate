Ext.define('Common.sevices.oauth.Claims',{

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
    
    /**
     * Protocol claims that should never be removed from profile.
     * "sub" is needed internally and others should remain required as per the OIDC specs.
     *
     * @internal
     */
    internalRequiredProtocolClaims:  ["sub", "iss", "aud", "exp", "iat"],

    constructor(config){
        this.settings = config.settings;
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

    mergeClaims(userProfile, jwtClaims){
        let me = this,
            settings = me.settings,
            result = { ...userProfile };

        for (let [claim, values] of Object.entries(jwtClaims)) {
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
                    if (typeof value === "object" && settings.mergeClaims) {
                        result[claim] = me.mergeClaims(previousValue, value);
                    }
                    else {
                        result[claim] = [previousValue, value];
                    }
                }
            }
        }

        return result;
    },

    destroy() {
        this.destroyMembers('defaultProtocolClaims', 'internalRequiredProtocolClaims', 'settings');
    }


    
})
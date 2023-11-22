Ext.define('Common.oidc.service.Claims', {
    alias: 'oidc.service.claims',

    requires: [
        'Common.oidc.setting.Client'
    ],

    /**
     * Protocol claims that could be removed by default from profile.
     * Derived from the following sets of claims:
     * - {@link https://datatracker.ietf.org/doc/html/rfc7519.html#section-4.1}
     * - {@link https://openid.net/specs/openid-connect-core-1_0.html#IDToken}
     * - {@link https://openid.net/specs/openid-connect-core-1_0.html#CodeIDToken}
     *
     * @internal
     */
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
    internalRequiredProtocolClaims: ["sub", "iss", "aud", "exp", "iat"],

    constructor(clientSettings) {
        this.settings = clientSettings.isInstance ? clientSettings : Ext.create('oidc.setting.client', clientSettings);
    },

    filterProtocolClaims(claims) {
        let me = this,
            settings = me.settings,
            result = { ...claims };

        if (settings.filterProtocolClaims) {
            let protocolClaims;
            if (Array.isArray(settings.filterProtocolClaims)) {
                protocolClaims = settings.filterProtocolClaims;
            } else {
                protocolClaims = Ext.clone(me.defaultProtocolClaims);
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

        if (settings.mergeClaims) {
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

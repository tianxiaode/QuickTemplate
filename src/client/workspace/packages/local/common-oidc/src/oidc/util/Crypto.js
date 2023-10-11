Ext.define('Common.oidc.util.Crypto',{
    alternateClassName: 'OidcCrypto',

    requires:[
        'Ext.data.identifier.Uuid',
        'Common.core.util.crypto.Sha256',
        'Common.core.util.crypto.Utf8',
        'Ext.util.Base64.decode'
    ],

    statics:{
        /**
         * PKCE: Generate a code verifier
         */
        generateCodeVerifier() {
            let uuid = Ext.data.identifier.Uuid.Global;
            return uuid.generate() + uuid.generate() + uuid.generate();
        },

        /**
         * PKCE: Generate a code challenge
         */
        generateCodeChallenge(code_verifier) {
            try {
                let hashed = SHA256(code_verifier);
                return Ext.util.Base64.decode(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            }
            catch (err) {
                Ext.Logger.log("CryptoUtils.generateCodeChallenge", err);
                throw err;
            }
        },

        /**
         * Generates a base64-encoded string for a basic auth header
         */
        generateBasicAuth(client_id, client_secret) {
            let basicAuth = Utf8.parse([client_id, client_secret].join(":")).toString();
            return Ext.util.Base64.encode(basicAuth);
        }
    
    }

})
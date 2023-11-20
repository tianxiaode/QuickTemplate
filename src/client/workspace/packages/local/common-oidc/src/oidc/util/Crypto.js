Ext.define('Common.oidc.util.Crypto',{

    requires:[
        'Ext.data.identifier.Uuid',
        'Common.core.util.crypto.Sha256',
        'Ext.util.Base64'
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
        generateCodeChallenge(codeVerifier) {
            try {
                let hashed = SHA256(codeVerifier);
                return Ext.util.Base64.decode(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            }
            catch (err) {
                Logger.log("CryptoUtils.generateCodeChallenge", err);
                throw new Error(err);
            }
        },

        /**
         * Generates a base64-encoded string for a basic auth header
         */
        generateBasicAuth(clientId, clientSecret) {
            let basicAuth = Ext.util.Base64.encode(`${clientId}:${clientSecret}`);
            return basicAuth;
        }
    
    }

}, ()=>{
    window.Oidc = window.Oidc || {};
    Oidc.Crypto = Common.oidc.util.Crypto;
})
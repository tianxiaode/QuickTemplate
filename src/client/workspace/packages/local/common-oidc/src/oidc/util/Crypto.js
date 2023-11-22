Ext.define('Common.oidc.util.Crypto',{

    requires:[
        'Ext.util.Base64'
    ],

    statics:{
        /**
         * PKCE: Generate a code verifier
         */
        generateCodeVerifier() {
            let uuid = window.crypto.randomUUID;
            return uuid() + uuid() + uuid();
        },

        /**
         * PKCE: Generate a code challenge
         */
        async generateCodeChallenge(codeVerifier) {
            try {
                let encoder = new TextEncoder(),
                    data = encoder.encode(codeVerifier),
                    hashed = await window.crypto.subtle.digest('SHA-256', data);
                return Ext.util.Base64.decode(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            }
            catch (error) {
                Logger.log(this, 'generateCodeChallenge', "CryptoUtils.generateCodeChallenge", error);
                throw new Error(error);
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
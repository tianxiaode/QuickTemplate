Ext.define('Common.oidc.util.Crypto',{
    alternateClassName: 'OidcCrypto',

    statics:{
        /**
         * PKCE: Generate a code verifier
         */
        generateCodeVerifier() {
            return OidcCrypto.generateUUIDv4() + OidcCrypto.generateUUIDv4() + OidcCrypto.generateUUIDv4();
        },

        /**
         * PKCE: Generate a code challenge
         */
        generateCodeChallenge(code_verifier) {
            try {
                let hashed = CryptoJS.SHA256(code_verifier);
                return CryptoJS.enc.Base64.stringify(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            }
            catch (err) {
                Ext.log("CryptoUtils.generateCodeChallenge", err);
                throw err;
            }
        },

        /**
         * Generates a base64-encoded string for a basic auth header
         */
        generateBasicAuth(client_id, client_secret) {
            let basicAuth = CryptoJS.enc.Utf8.parse([client_id, client_secret].join(":"));
            return CryptoJS.enc.Base64.stringify(basicAuth);
        }
    
    }

})
Ext.define('Common.oidc.util.Crypto',{
    alternateClassName: 'OidcCrypto',

    statics:{
        UUID_V4_TEMPLATE: "10000000-1000-4000-8000-100000000000",

        randomWord(){
            return CryptoJS.lib.WordArray.random(1).words[0];
        },

        /**
         * Generates RFC4122 version 4 guid
         */
        generateUUIDv4() {
            let uuid = OidcCrypto.UUID_V4_TEMPLATE.replace(/[018]/g, c =>
                (+c ^ OidcCrypto.randomWord() & 15 >> +c / 4).toString(16),
            );
            return uuid.replace(/-/g, "");
        },
    
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
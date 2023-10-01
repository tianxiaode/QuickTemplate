Ext.define('Oauth.CryptoUtils',{
    alternateClassName: 'OauthCryptoUtils',

    statics:{
        UUID_V4_TEMPLATE: "10000000-1000-4000-8000-100000000000",

        randomWord(){
            return CryptoJS.lib.WordArray.random(1).words[0];
        },

        /**
         * Generates RFC4122 version 4 guid
         */
        generateUUIDv4() {
            let uuid = OauthCryptoUtils.UUID_V4_TEMPLATE.replace(/[018]/g, c =>
                (+c ^ OauthCryptoUtils._randomWord() & 15 >> +c / 4).toString(16),
            );
            return uuid.replace(/-/g, "");
        },
    
        /**
         * PKCE: Generate a code verifier
         */
        generateCodeVerifier() {
            return OauthCryptoUtils.generateUUIDv4() + OauthCryptoUtils.generateUUIDv4() + OauthCryptoUtils.generateUUIDv4();
        },

        /**
         * PKCE: Generate a code challenge
         */
        generateCodeChallenge(code_verifier) {
            try {
                let hashed = sha256(code_verifier);
                return Base64.stringify(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
            let basicAuth = Utf8.parse([client_id, client_secret].join(":"));
            return Base64.stringify(basicAuth);
        }
    
    }

})
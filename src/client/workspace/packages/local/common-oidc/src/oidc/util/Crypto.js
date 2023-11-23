Ext.define('Common.oidc.util.Crypto', {

    statics: {

        generateUUIDv4() {
            return window.crypto.randomUUID().replace(/-/g, '');
        },

        /**
         * PKCE: Generate a code verifier
         */
        generateCodeVerifier() {
            let crypto = Oidc.Crypto;
            return crypto.generateUUIDv4() + crypto.generateUUIDv4() + crypto.generateUUIDv4();
        },

        /**
         * PKCE: Generate a code challenge
         */
        async generateCodeChallenge(codeVerifier) {
            try {
                let encoder = new TextEncoder(),
                    data = encoder.encode(codeVerifier),
                    hashed = await window.crypto.subtle.digest('SHA-256', data);
                return Oidc.Crypto.toBase64(hashed).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            }
            catch (error) {
                Logger.log(this.generateCodeChallenge, 'generateCodeChallenge', 'CryptoUtils.generateCodeChallenge', error);
                throw new Error(error);
            }
        },

        /**
         * Generates a base64-encoded string for a basic auth header
         */
        generateBasicAuth(clientId, clientSecret) {
            let encoder = new TextEncoder();
            let data = encoder.encode([clientId, clientSecret].join(":"));
            return Oidc.Crypto.toBase64(data);
        },

        toBase64(val) {
            return btoa([...new Uint8Array(val)]
                .map((chr) => String.fromCharCode(chr))
                .join(""));
        }

    }

}, () => {
    window.Oidc = window.Oidc || {};
    Oidc.Crypto = Common.oidc.util.Crypto;
})
Ext.define('Common.oidc.state.Signin',{
    extend: 'Common.oidc.state.State',
    alias: 'oidc.state.signin',

     codeVerifier: null,
    /** Used to secure authorization code grants via Proof Key for Code Exchange (PKCE). */
     codeChallenge: null,

    // to ensure state still matches settings
    /** @see {@link OidcClientSettings.authority} */
     authority: null,
    /** @see {@link OidcClientSettings.client_id} */
     clientId: null,
    /** @see {@link OidcClientSettings.redirect_uri} */
     redirectUri: null,
    /** @see {@link OidcClientSettings.scope} */
     scope: null,
    /** @see {@link OidcClientSettings.client_secret} */
     clientSecret: null,
    /** @see {@link OidcClientSettings.extraTokenParams} */
     extraTokenParams: null,
    /** @see {@link OidcClientSettings.response_mode} */
     responseMode: null,

     skipUserInfo: false,

     statics:{
        fromStorageString(storageString){
            let data = JSON.parse(storageString);
            return Ext.create('oidc.state.signin', data);
        }
     },

     constructor(config){
        let me = this;
        me.callParent(arguments);
        if(me.codeVerifier === true){
            me.codeVerifier = Oidc.Crypto.generateCodeVerifier();
        }

        if(me.codeVerifier){
            me.codeChallenge = Oidc.Crypto.generateCodeChallenge(me.codeVerifier);
        }
     },

     toStorageString() {
        let me = this;
        return JSON.stringify({
            id: me.id,
            data: me.data,
            created: me.created,
            requestType: me.requestType,

            codeVerifier: me.codeVerifier,
            authority: me.authority,
            clientId: me.clientId,
            redirectUri: me.redirectUri,
            scope: me.scope,
            clientSecret: me.clientSecret,
            extraTokenParams : me.extraTokenParams,
            responseMode: me.responseMode,
            skipUserInfo: me.skipUserInfo,
        });
    }     
})

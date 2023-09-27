/**
 * 参考abp的ng.oauth编写的 (https://github.com/abpframework/abp)
 */

Ext.define('Common.service.oauth.AuthFlowStrategy',{

    mixins: [
        'Ext.mixin.Observable'
    ],

    constructor(config) {
        let me = this,
            clientId;
        me.mixins.observable.constructor.call(me, config);
        Ext.apply(me, AppConfig.oAuthConfig);
        me.storage = AppStorage;
        clientId = me.clientId;
        if (clientId) {
            const shouldClear = me.shouldStorageClear(clientId);
            if (shouldClear)
                me.clearOAuthStorage(oAuthStorage);
        }
        // this.oAuthService.configure(this.oAuthConfig);
        // this.oAuthService.events
        //     .pipe(filter(event => event.type === 'token_refresh_error'))
        //     .subscribe(() => this.navigateToLogin());
        // this.navigateToPreviousUrl();
        // return Odic
        //     .loadDiscoveryDocument()
        //     .then(() => {
        //     if (this.oAuthService.hasValidAccessToken() || !this.oAuthService.getRefreshToken()) {
        //         return Promise.resolve();
        //     }
        //     return this.refreshToken();
        // })
        //     .catch(this.catchError);
    },

    navigateToPreviousUrl() {
        const { responseType } = this.oAuthConfig;
        if (responseType === 'code') {
            this.oAuthService.events
                .pipe(filter(event => event.type === 'token_received' && !!this.oAuthService.state), take(1), map(() => {
                const redirect_uri = decodeURIComponent(this.oAuthService.state);
                if (redirect_uri && redirect_uri !== '/') {
                    return redirect_uri;
                }
                return '/';
            }), switchMap(redirectUri => this.configState.getOne$('currentUser').pipe(filter(user => !!user?.isAuthenticated), tap(() => this.router.navigate([redirectUri])))))
                .subscribe();
        }
    },

    refreshToken() {
        return this.oAuthService.refreshToken().catch(() => clearOAuthStorage());
    },
    
    listenToOauthErrors() {
        this.oAuthService.events
            .pipe(filter(event => event instanceof OAuthErrorEvent), tap(() => clearOAuthStorage()), switchMap(() => this.configState.refreshAppState()))
            .subscribe();
    },

    privates:{
        oauthClientIdKey: 'oauthClientId',
        storageKeys: {
            accessToken: 'access_token',
            idToken: 'id_token',
            expiresAt: 'expires_at',
            refreshToken: 'refresh_token',
            originHash: 'originHash',
            nonce: 'nonce',
            PKCE_verifier: 'PKCE_verifier',
            idTokenClaimsObj: 'id_token_claims_obj',
            idTokenExpiresAt: 'id_token_expires_at',
            idTokenStoredAt: 'id_token_stored_at',
            accessTokenStoredAt: 'access_token_stored_at',
            grantedScopes: 'granted_scopes',
            sessionState: 'session_state'
        },

        shouldStorageClear(clientId) {
            let me = this,
                key = me.oauthClientIdKey,
                storage = me.storage,
                storageClientId = storage.get(key);
            if(!storageClientId) {
                storage.set(key, clientId);
                return false;
            }
            const shouldClear = storageClientId !== clientId;
            if (shouldClear)
                storage.set(key, clientId);
            return shouldClear;
        },

        clearOAuthStorage(){
            let me = this,
                storage = me.storage;
            Ext.each(Object.values(me.storageKeys),key=>{
                storage.remove(key);
            })
        }
    }

})
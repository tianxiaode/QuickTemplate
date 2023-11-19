Ext.define('Common.oidc.ResponseValidator',{
    alias: 'oidc.responsevalidator',

    requires:[
        'Common.oidc.util.Jwt',
    ],

    tokenClient: null,

    constructor(config){
        let me = this;
        me.settings = config.settings;
        me.metadataService = config.metadataService;
        me.claimsService = config.claimsService;
    },

    async validateSigninResponse(response, state){
        let me = this;

        me.processSigninState(response, state);
        Logger.debug(me , "state processed");

        await me.processCode(response, state);
        Logger.debug(me ,"code processed");

        if (response.isOpenId) {
            me.validateIdTokenAttributes(response);
        }
        Logger.debug(me , "tokens validated");

        await this.processClaims(response, state?.skipUserInfo, response.isOpenId);
        Logger.debug(me, "claims processed");
    },

    async validateCredentialsResponse(response, skipUserInfo) {
        let me = this;

        if (response.isOpenId) {
            me.validateIdTokenAttributes(response);
        }
        Logger.debug(me , "tokens validated");

        await me.processClaims(response, skipUserInfo, response.isOpenId);
        Logger.debug(me , "claims processed");
    },
   
    async validateRefreshResponse(response, state){
        let me = this;

        response.userState = state.data;
        // if there's no session_state on the response, copy over session_state from original request
        response.session_state ??= state.session_state;
        // if there's no scope on the response, then assume all scopes granted (per-spec) and copy over scopes from original request
        response.scope ??= state.scope;

        // OpenID Connect Core 1.0 says that id_token is optional in refresh response:
        // https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokenResponse
        if (response.isOpenId && !!response.id_token) {
            me.validateIdTokenAttributes(response, state.id_token);
            Logger.debug(me , "ID Token validated");
        }

        if (!response.id_token) {
            // if there's no id_token on the response, copy over id_token from original request
            response.id_token = state.id_token;
            // and decoded part too
            response.profile = state.profile;
        }

        let hasIdToken = response.isOpenId && !!response.id_token;
        await me.processClaims(response, false, hasIdToken);
        Logger.debug(me , "claims processed");
    },

    validateSignoutResponse(response, state) {
        let me = this;
        if (state.id !== response.state) {
            throw new Error("State does not match");
        }

        // now that we know the state matches, take the stored data
        // and set it into the response so callers can get their state
        // this is important for both success & error outcomes
        Logger.debug(me , "state validated");
        response.userState = state.data;

        if (response.error) {
            Logger.warn(me, "Response was error", response.error);
            throw new Error(response);
        }
    },


    destroy() {
        this.destroyMembers('settings', 'metadataService', 'claimsService');
        this.callParent();
    },

    privates:{
        processSigninState(response, state) {
            let me = this,
                settings = me.settings;
            if (state.id !== response.state) {
                throw new Error("State does not match");
            }
    
            if (!state.client_id) {
                throw new Error("No client_id on state");
            }
    
            if (!state.authority) {
                throw new Error("No authority on state");
            }
    
            // ensure we're using the correct authority
            if (settings.authority !== state.authority) {
                throw new Error("authority mismatch on settings vs. signin state");
            }
            if (settings.clientId && settings.clientId !== state.client_id) {
                throw new Error("client_id mismatch on settings vs. signin state");
            }
    
            // now that we know the state matches, take the stored data
            // and set it into the response so callers can get their state
            // this is important for both success & error outcomes
            Logger.debug(me , "state validated");
            response.userState = state.data;
            // if there's no scope on the response, then assume all scopes granted (per-spec) and copy over scopes from original request
            response.scope ??= state.scope;
    
            if (response.error) {
                Logger.warn(me, "Response was error", response.error);
                throw new Error(response);
            }
    
            if (state.code_verifier && !response.code) {
                throw new Error("Expected code in response");
            }
    
        },

        async processClaims(response, skipUserInfo, validateSub){
            let me = this,
                settings = me.settings;
            response.profile = me.claimsService.filterProtocolClaims(response.profile);
    
            if (skipUserInfo || !settings.loadUserInfo || !response.access_token) {
                Logger.debug(me , "not loading user info");
                return;
            }
    
            Logger.debug(me, "loading user info");
            let claims = await me.userInfoService.getClaims(response.access_token);
            Logger.debug(me, "user info claims received from user info endpoint");
    
            if (validateSub && claims.sub !== response.profile.sub) {
                throw new Error("subject from UserInfo response does not match subject in ID Token");
            }
    
            response.profile = me.claimsService.mergeClaims(response.profile, me.claimsService.filterProtocolClaims(claims));
            Logger.debug(me , "user info claims received, updated profile:", response.profile);
        },
    
        async processCode(response, state){
            let me = this;
            if (response.code) {
                Logger.debug(me, "Validating code");
                let tokenResponse = await me.tokenClient.exchangeCode({
                    clientId: state.client_id,
                    clientSecret: state.client_secret,
                    code: response.code,
                    redirectUri: state.redirect_uri,
                    codeVerifier: state.code_verifier,
                    ...state.extraTokenParams,
                });
                Object.assign(response, tokenResponse);
            } else {
                Logger.debug(me, "No code to process");
            }
        },
    
        validateIdTokenAttributes(response, existingToken){
            let me = this;
    
            Logger.debug(me, "decoding ID Token JWT");
            let incoming = Oidc.Jwt.decode(response.id_token ?? "");
    
            if (!incoming.sub) {
                throw new Error("ID Token is missing a subject claim");
            }
    
            if (existingToken) {
                let existing = Oidc.Jwt.decode(existingToken);
                if (incoming.sub !== existing.sub) {
                    throw new Error("sub in id_token does not match current sub");
                }
                if (incoming.auth_time && incoming.auth_time !== existing.auth_time) {
                    throw new Error("auth_time in id_token does not match original auth_time");
                }
                if (incoming.azp && incoming.azp !== existing.azp) {
                    throw new Error("azp in id_token does not match original azp");
                }
                if (!incoming.azp && existing.azp) {
                    throw new Error("azp not in id_token, but present in original id_token");
                }
            }
    
            response.profile = incoming;
        }      
    
    }


})
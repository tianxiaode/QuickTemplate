Ext.define('Common.sevices.oauth.ResponseValidator',{

    constructor(config) {
        Ext.apply(this, config);
    },

    async validateSigninResponse(response, state){
        let me = this;
        me.processSigninState(response, state);
        Ext.debug("state processed");

        await me.processCode(response, state);
        Ext.debug("code processed");

        if (response.isOpenId) {
            me.validateIdTokenAttributes(response);
        }
        Ext.debug("tokens validated");

        await me.processClaims(response, state?.skipUserInfo, response.isOpenId);
        Ext.debug("claims processed");
    },

    async validateCredentialsResponse(response, skipUserInfo){
        let me = this;
        if (response.isOpenId) {
            me.validateIdTokenAttributes(response);
        }
        Ext.debug("tokens validated");

        await me.processClaims(response, skipUserInfo, response.isOpenId);
        me.debug("claims processed");
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
            me._validateIdTokenAttributes(response, state.id_token);
            Ext.debug("ID Token validated");
        }

        if (!response.id_token) {
            // if there's no id_token on the response, copy over id_token from original request
            response.id_token = state.id_token;
            // and decoded part too
            response.profile = state.profile;
        }

        let hasIdToken = response.isOpenId && !!response.id_token;
        await me.processClaims(response, false, hasIdToken);
        Ext.debug("claims processed");
    },

    validateSignoutResponse(response, state){
        if (state.id !== response.state) {
            Ext.raise("State does not match");
        }

        // now that we know the state matches, take the stored data
        // and set it into the response so callers can get their state
        // this is important for both success & error outcomes
        Ext.debug("state validated");
        response.userState = state.data;

        if (response.error) {
            Ext.warn("Response was error", response.error);
            throw response;
        }
    },

    destroy(){
        this.destroyMembers('setrrings');
    },

    privates:{
        processSigninState(response, state){
            let me = this,
                settings = me.settings;
            if (state.id !== response.state) {
                Ext.raise("State does not match");
            }
    
            if (!state.client_id) {
                Ext.raise("No client_id on state");
            }
    
            if (!state.authority) {
                Ext.raise("No authority on state");
            }
    
            // ensure we're using the correct authority
            if (settings.authority !== state.authority) {
                Ext.raise("authority mismatch on settings vs. signin state");
            }
            if (settings.client_id && settings.client_id !== state.client_id) {
                Ext.raise("client_id mismatch on settings vs. signin state");
            }
    
            // now that we know the state matches, take the stored data
            // and set it into the response so callers can get their state
            // this is important for both success & error outcomes
            Ext.debug("state validated");
            response.userState = state.data;
            // if there's no scope on the response, then assume all scopes granted (per-spec) and copy over scopes from original request
            response.scope ??= state.scope;
    
            if (response.error) {
                Ext.warn("Response was error", response.error);
                throw response;
            }
    
            if (state.code_verifier && !response.code) {
                Ext.raise("Expected code in response");
            }
    
        },
    
        async processClaims(response, skipUserInfo, validateSub) {
            let me = this,
                claims = me.claims;
            response.profile = claims.filterProtocolClaims(response.profile);
    
            if (skipUserInfo || !this._settings.loadUserInfo || !response.access_token) {
                logger.debug("not loading user info");
                return;
            }
    
            logger.debug("loading user info");
            const claims = await this._userInfoService.getClaims(response.access_token);
            logger.debug("user info claims received from user info endpoint");
    
            if (validateSub && claims.sub !== response.profile.sub) {
                logger.throw(new Error("subject from UserInfo response does not match subject in ID Token"));
            }
    
            response.profile = this._claimsService.mergeClaims(response.profile, this._claimsService.filterProtocolClaims(claims as IdTokenClaims));
            logger.debug("user info claims received, updated profile:", response.profile);
        },
    
        async processCode(response, state) {
            if (response.code) {
                logger.debug("Validating code");
                const tokenResponse = await this._tokenClient.exchangeCode({
                    client_id: state.client_id,
                    client_secret: state.client_secret,
                    code: response.code,
                    redirect_uri: state.redirect_uri,
                    code_verifier: state.code_verifier,
                    ...state.extraTokenParams,
                });
                Object.assign(response, tokenResponse);
            } else {
                Ext.debug("No code to process");
            }
        },
    
        validateIdTokenAttributes(response: SigninResponse, existingToken?: string): void {
            const logger = this._logger.create("_validateIdTokenAttributes");
    
            logger.debug("decoding ID Token JWT");
            const incoming = JwtUtils.decode(response.id_token ?? "");
    
            if (!incoming.sub) {
                logger.throw(new Error("ID Token is missing a subject claim"));
            }
    
            if (existingToken) {
                const existing = JwtUtils.decode(existingToken);
                if (incoming.sub !== existing.sub) {
                    logger.throw(new Error("sub in id_token does not match current sub"));
                }
                if (incoming.auth_time && incoming.auth_time !== existing.auth_time) {
                    logger.throw(new Error("auth_time in id_token does not match original auth_time"));
                }
                if (incoming.azp && incoming.azp !== existing.azp) {
                    logger.throw(new Error("azp in id_token does not match original azp"));
                }
                if (!incoming.azp && existing.azp) {
                    logger.throw(new Error("azp not in id_token, but present in original id_token"));
                }
            }
    
            response.profile = incoming as UserProfile;
        }
    
    } //end privates


})
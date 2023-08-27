Ext.define('Common.service.OAuth', {
    alternateClassName: 'Auth',
    singleton: true,

    mixins: [
        'Ext.mixin.Observable'
    ],

    nonceStateSeparator: ';',
    responseType: 'code',
    loginUrl: '',
    logoutUrl: '',
    oidc: true,
    disablePKCE: false,
    resource: '',

    constructor(config) {
        let me = this;
        me.mixins.observable.constructor.call(me, config);
        Ext.apply(me, AppConfig.oAuthConfig);
        me.loginUrl = `${AppConfig.apiUrl}connect/authorize`;
        me.logoutUrl = `${AppConfig.apiUrl}connect/endsession`;
    },


    /**
     * 验证是否已认�?
     * 验证方式为access_token是否存在，且是否已过�?
     */
    isAuthenticated() {
        let me = this,
            storage = AppStorage,
            keys = me.storageKeys,
            token = storage.get(keys.accessToken);
        if (token) {
            let expiresAt = storage.get(keys.expiresAt),
                now = new Date(),
                isAuthenticated = expiresAt && parseInt(expiresAt, 10) > now.getTime();
            //如果token已过期，清除全部数据
            if (!isAuthenticated) me.removeAllStorageItem();
            return isAuthenticated;
        }
        return false;
    },

    /**
     * 登录
     * 通过用户�?/邮箱/手机和密码获取access_token
     * @param {用户名} username 
     * @param {密码} password 
     */
    login(hash) {
        let me = this;
        return me.tryLogin(hash).then(() => { }, () => {
            let url = me.createLoginUrl('', '', null, false, {});
            console.log('login', url, arguments)
            window.location.href = url;
        })
    },

    tryLogin(hash) {
        let me = this;
        options = AppConfig.oAuthConfig,
            location = window.location,
            querySource = location.search,
            parts = me.getCodePartsFromUrl(querySource),
            code = parts['code'],
            state = parts['state'],
            sessionState = parts['session_state'];
        if (!code) {
            AppStorage.set(me.storageKeys.originHash, hash);
        }
        if (!options.preventClearHashAfterLogin) {
            let href = location.href;
            Object.keys(parts).forEach(key => {
                let replace = new RegExp(`[&\?]${key}=[^&\$]*`);
                href = href.replace(replace, '');
            })
            //href += `#${AppStorage.get(me.storageKeys.originHash)}`;
            // const href = location.href
            //     .replace(/[&\?]code=[^&\$]*/, '')
            //     .replace(/[&\?]scope=[^&\$]*/, '')
            //     .replace(/[&\?]state=[^&\$]*/, '')
            //     .replace(/[&\?]iss=[^&\$]*/, '')
            //     .replace(/[&\?]session_state=[^&\$]*/, '');
            history.replaceState(null, window.name, href);
        }
        let [nonceInState, userState] = me.parseState(state);
        me.state = userState;
        if (parts['error'] || !nonceInState || !code) {
            return Promise.reject();
        }
        const success = me.validateNonce(nonceInState);
        if (!success) {
            return Promise.reject();
        }
        AppStorage.set('session_state', sessionState);
        return me.getTokenFromCode(code, options);
    },


    /**
     * 退出
     * 需要注销access_token和refresh_token并移除存储数�?
     */
    logout() {
        let me = this,
            storage = AppStorage,
            keys = me.storageKeys,
            idToken = storage.get(keys.idToken),
            logoutUrl = me.logoutUrl;
        me.removeAllStorageItem();
        logoutUrl = `${logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(me.redirectUri)}`;
        window.location.href = logoutUrl;
    },

    getOrginHash(){
        return AppStorage.get(this.storageKeys.originHash);
    },

    removeOrginHash(){
        AppStorage.remove(this.storageKeys.originHash);
    },

    destroy() {
        let me = this;
        me.storageKeys = null;
        me.endpoints = null;
    },

    privates: {

        storageKeys: {
            accessToken: 'access_token',
            idToken: 'id_token',
            expiresAt: 'expires_at',
            refreshToken: 'refresh_token',
            originHash: 'originHash'
        },

        remoteController: 'connect',
        endpoints: {
            authorization: 'authorize',
            token: 'token',
            revocation: 'revocation',
            endSession: 'endsession'
        },
        //scopes: "profile email phone role QuickTemplate offline_access",

        /**
         * 登录成功
         * @param {获取令牌的结果} response 
         */
        loginSuccess(response) {
            let me = this,
                obj = me.processToken(response);
            me.fireEvent('loginsuccess', obj);
        },

        /**
         * 刷新令牌
         * @param {组织编号} organizationUnitId 
         */
        refreshToken(id, name) {
            Ext.Viewport.setMasked(Ext.String.format(I18N.get('RefreshToken'), name));
            let me = this,
                data = {
                    'grant_type': 'refresh_token',
                    'refresh_token': AppStorage.get(me.storageKeys.refreshToken),
                    'scope': me.scope,
                    'organizationUnitId': id
                };
            let promise = me.send(data, me.endpoints.token)
            promise.then(me.refreshTokenSuccess, me.getTokenFailure, null, me);
            return promise;
        },

        /**
         * 
         * @param {获取令牌的结果} response 
         */
        refreshTokenSuccess(response) {
            Ext.Viewport.setMasked(false);
            let me = this,
                obj = me.processToken(response);
            //发送登录已完成事件
            me.fireEvent('refreshtokensuccess', obj);
        },

        /**
         * 处理令牌成功
         * @param {获取令牌的结果} response 
         */
        processToken(response) {
            let obj = Ext.decode(response.responseText, true);
            if (!obj) {
                MsgBox(null, I18N.getUnknownError());
                return;
            }
            let me = this,
                storage = AppStorage,
                keys = me.storageKeys,
                now = new Date(),
                expiresAt = now.getTime() + (obj.expires_in || 0) * 1000;
            storage.set(keys.accessToken, obj[keys.accessToken]);
            storage.set(keys.expiresAt, expiresAt, true);
            storage.set(keys.refreshToken, obj[keys.refreshToken]);
            storage.set(keys.idToken, obj[keys.idToken])
            return obj;
        },

        /**
         * 获取令牌失败，显示异常
         * @param {获取令牌结果} response 
         */
        getTokenFailure(response) {
            return Failure.ajax.apply(this, [response]);
        },

        /**
         * 发送请求
         * @param {要发送的数据} data 
         * @param {端点} endpoint 
         */
        send(data, endpoint) {
            let me = this,
                clientId = me.clientId,
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "accept-language": AppStorage.get('lang')
                };
            data['client_id'] = clientId;
            return Http.post(
                URI.get(me.remoteController, endpoint, true),
                data,
                headers
            );
        },

        /**
         * 获取认证头
         * @param {是否包含JSON Content头}} includeJsonContent 
         */
        getAuthorizationHeader(includeJsonContent) {
            let me = this,
                headers = {
                    'Authorization': 'Bearer ' + AppStorage.get(me.storageKeys.accessToken),
                    //'Access-Control-Allow-Origin': '*',
                    "accept-language": AppStorage.get('lang')
                };
            if (includeJsonContent) {
                headers['Content-Type'] = 'application/json;charset=utf-8';
            }
            return headers;
        },



        /**
         * 移除全部缓存令牌数据
         */
        removeAllStorageItem() {
            Object.keys(this.storageKeys).forEach(key => {
                AppStorage.remove(this.storageKeys[key]);
            })
        },

        calcHash(valueToHash, algorithm) {
            const hashArray = sha256.array(valueToHash);
            const hashString = this.toHashString2(hashArray);
            return hashString;
        },

        toHashString2(byteArray) {
            let result = '';
            for (let e of byteArray) {
                result += String.fromCharCode(e);
            }
            return result;
        },

        toHashString(buffer) {
            const byteArray = new Uint8Array(buffer);
            let result = '';
            for (let e of byteArray) {
                result += String.fromCharCode(e);
            }
            return result;
        },

        getCodePartsFromUrl(queryString) {
            if (!queryString || queryString.length === 0) {
                return this.getHashFragmentParams();
            }
            // normalize query string
            if (queryString.charAt(0) === '?') {
                queryString = queryString.substr(1);
            }
            return Ext.Object.fromQueryString(queryString);
        },

        getHashFragmentParams(customHashFragment) {
            let hash = customHashFragment || window.location.hash;
            hash = decodeURIComponent(hash);
            if (hash.indexOf('#') !== 0) {
                return {};
            }
            const questionMarkPosition = hash.indexOf('?');
            if (questionMarkPosition > -1) {
                hash = hash.substr(questionMarkPosition + 1);
            }
            else {
                hash = hash.substr(1);
            }
            return Ext.Object.fromQueryString(hash);
        },

        parseState(state) {
            let nonce = state;
            let userState = '';
            if (state) {
                const idx = state.indexOf(this.config.nonceStateSeparator);
                if (idx > -1) {
                    nonce = state.substr(0, idx);
                    userState = state.substr(idx + this.config.nonceStateSeparator.length);
                }
            }
            return [nonce, userState];
        },

        validateNonce(nonceInState) {
            let savedNonce;
            savedNonce = AppStorage.get('nonce');
            if (savedNonce !== nonceInState) {
                const err = 'Validating access_token failed, wrong state/nonce.';
                return false;
            }
            return true;
        },

        getTokenFromCode(code, options) {
            let me = this,
                verifier = AppStorage.get('PKCE_verifier'),
                data = {
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': me.redirectUri,
                    'code_verifier': verifier
                };
            let promise = me.send(data, me.endpoints.token);
            promise.then(me.getTokenFromCodeSuccess, me.getTokenFromCodeFailure, null, me);
            return promise;

        },

        getTokenFromCodeSuccess(response) {
            let me = this;
            me.processToken(response);
            me.fireEvent('loggedin');
        },

        getTokenFromCodeFailure(response) {
            let me = this,
                current = I18N.getCurrentLanguage() || 'zh-CN',
                msg = AppConfig.loginFailure[current];
            MsgBox.alert('', msg);
            me.fireEvent('loginfailtre');
        },

        createLoginUrl() {
            let me = this,
                redirectUri = me.redirectUri,
                nonce = me.createAndSaveNonce(),
                state = nonce,
                seperationChar = me.loginUrl.indexOf('?') > -1 ? '&' : '?',
                scope = me.scope;
            if (me.oidc && !scope.match(/(^|\s)openid($|\s)/)) {
                scope = 'openid ' + scope;
            }
            let url = me.loginUrl +
                seperationChar +
                'response_type=' +
                encodeURIComponent(me.responseType) +
                '&client_id=' +
                encodeURIComponent(me.clientId) +
                '&state=' +
                encodeURIComponent(state) +
                '&redirect_uri=' +
                encodeURIComponent(redirectUri) +
                '&scope=' +
                encodeURIComponent(scope);
            if (me.responseType.includes('code') && !me.disablePKCE) {
                const [challenge, verifier] = me.createChallangeVerifierPairForPKCE();
                AppStorage.set('PKCE_verifier', verifier);
                url += '&code_challenge=' + challenge;
                url += '&code_challenge_method=S256';
            }
            // if (loginHint) {
            //     url += '&login_hint=' + encodeURIComponent(loginHint);
            // }
            if (me.resource) {
                url += '&resource=' + encodeURIComponent(me.resource);
            }
            if (me.oidc) {
                url += '&nonce=' + encodeURIComponent(nonce);
            }
            return url;
        },

        createAndSaveNonce() {
            let me = this,
                nonce = me.createNonce();
            AppStorage.set('nonce', nonce);
            return nonce;
        },

        createNonce() {
            /*
                * This alphabet is from:
                * https://tools.ietf.org/html/rfc7636#section-4.1
                *
                * [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
                */
            let unreserved = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~',
                size = 45,
                id = '',
                crypto = typeof self === 'undefined' ? null : self.crypto || self['msCrypto'];
            if (crypto) {
                let bytes = new Uint8Array(size);
                crypto.getRandomValues(bytes);
                // Needed for IE
                if (!bytes.map) {
                    bytes.map = Array.prototype.map;
                }
                bytes = bytes.map(x => unreserved.charCodeAt(x % unreserved.length));
                id = String.fromCharCode.apply(null, bytes);
            }
            else {
                while (0 < size--) {
                    id += unreserved[(Math.random() * unreserved.length) | 0];
                }
            }
            return Ext.util.Format.base64UrlEncode(id);
        },

        createChallangeVerifierPairForPKCE() {
            let me = this,
                verifier = me.createNonce(),
                challengeRaw = me.calcHash(verifier, 'sha-256'),
                challenge = Ext.util.Format.base64UrlEncode(challengeRaw);
            return [challenge, verifier];
        }

    }



});
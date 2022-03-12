Ext.define('Common.shared.service.OAuth', {
    alternateClassName: 'Auth',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],

    nonceStateSeparator: ';',
    responseType : 'code',
    loginUrl: '',
    logoutUrl: '',
    oidc: true,
    disablePKCE: false,
    resource: '',

    constructor(config){
        let me = this;
        me.mixins.observable.constructor.call(me, config);
        Ext.apply(me, AppConfig.oAuthConfig);
        me.loginUrl = `${AppConfig.apiUrl}connect/authorize`;
        me.logoutUrl = `${AppConfig.apiUrl}connect/endsession`
    },


    /**
     * 验证是否已认�?
     * 验证方式为access_token是否存在，且是否已过�?
     */
    isAuthenticated(){
        let me = this,
            storage = AppStorage,
            keys = me.storageKeys,
            token = storage.get(keys.accessToken);
        if(token){
            let expiresAt = storage.get(keys.expiresAt),
                now = new Date(),
                isAuthenticated = expiresAt && parseInt(expiresAt, 10) > now.getTime();
            //如果token已过期，清除全部数据
            if(!isAuthenticated) me.removeAllStorageItem();
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
    login(){
        let me = this;
        if(!me.tryLogin())
        {
            let url = this.createLoginUrl('', '', null, false, {});
            window.location.href = url;    
        }
        // let me = this,
        //     data = {
        //         'grant_type': 'password',
        //         'scope': me.scopes,
        //         'username': username,
        //         'password': password,
        //     };
        // let promise = me.send(data, me.endpoints.token);
        // promise.then(me.loginSuccess, null,null, me)
        // return promise;
    },

    tryLogin() {
        const me = this; 
            options = AppConfig.oAuthConfig;
        const querySource = window.location.search;
        const parts = me.getCodePartsFromUrl(querySource);
        const code = parts['code'];
        const state = parts['state'];
        const sessionState = parts['session_state'];
        if (!options.preventClearHashAfterLogin) {
            const href = location.href
                .replace(/[&\?]code=[^&\$]*/, '')
                .replace(/[&\?]scope=[^&\$]*/, '')
                .replace(/[&\?]state=[^&\$]*/, '')
                .replace(/[&\?]session_state=[^&\$]*/, '');
            history.replaceState(null, window.name, href);
        }
        let [nonceInState, userState] = me.parseState(state);
        me.state = userState;
        if (parts['error']) {
            return false;
        }
        if (!nonceInState) {
            return false;
        }
        const success = me.validateNonce(nonceInState);
        if (!success) {
            return false;
        }
        AppStorage.set('session_state', sessionState);
        if (code) {
            me.getTokenFromCode(code, options);
            return true;
        }
        else {
            return false;
        }
    },




    /**
     * 退�?
     * 需要注销access_token和refresh_token并移除存储数�?
     */
    logout(){
        let me = this,
            storage = AppStorage,
            keys = me.storageKeys,
            tokenKey = keys.accessToken,
            refreshTokenKey = keys.refreshToken,
            token = storage.get(tokenKey),
            refreshToken = storage.get(refreshTokenKey);
        if(token){
            let data = {
                'token' : token,
                'token_type_hint': tokenKey
                };
            me.send(data, me.endpoints.revocation);
        }
        if(refreshToken){
            let data ={
                'token' : refreshToken,
                'token_type_hint': refreshTokenKey
            };
            me.send(data, me.endpoints.revocation);
        }
        me.removeAllStorageItem();
    },


    /**
     * 获取认证头
     * @param {是否包含JSON Content头}} includeJsonContent 
     */
    getAuthorizationHeader(includeJsonContent){
        let me = this,
            headers = {
                'Authorization' : 'Bearer ' +  AppStorage.get(me.storageKeys.accessToken),
                //'Access-Control-Allow-Origin': '*',
                "accept-language": AppStorage.get('lang')
            };
        if(includeJsonContent){
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }    
        return headers;
    },


    privates:{

        storageKeys:{
            accessToken: 'access_token',
            idToken: 'id_token',
            expiresAt: 'expires_at',
            refreshToken: 'refresh_token',
        },
    
        remoteController: 'connect',
        endpoints:{
            authorization: 'authorize',
            token: 'token',
            revocation: 'revocation',
            endSession: 'endsession',
    
        },
        scopes: "profile email phone role Service offline_access",
    
        /**
         * 登录成功
         * @param {获取令牌的结果} response 
         */
        loginSuccess(response){
            let me = this,
                obj = me.processToken(response);
            me.fireEvent('loginsuccess', obj);
        },

        /**
         * 刷新令牌
         * @param {组织编号} organizationUnitId 
         */
        refreshToken(id, name){
            Ext.Viewport.setMasked(Ext.String.format(I18N.get('RefreshToken'), name));
            let me = this,
                data = {
                    'grant_type': 'refresh_token',
                    'refresh_token': AppStorage.get(me.storageKeys.refreshToken),
                    'scope': me.scopes,
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
        refreshTokenSuccess(response){
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
        processToken(response){
            let obj  = Ext.decode(response.responseText,true);
            if(!obj) {
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
            return obj;
        },
    
        /**
         * 获取令牌失败，显示异常
         * @param {获取令牌结果} response 
         */
        getTokenFailure(response){
            return Failure.ajax.apply(this, [response]);
        },

        /**
         * 发送请求
         * @param {要发送的数据} data 
         * @param {端点} endpoint 
         */
        send(data, endpoint){
            let me = this,
                clientId = AppConfig.oAuthConfig.clientId,
                clientSecret = AppConfig.oAuthConfig.dummyClientSecret,
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "accept-language": AppStorage.get('lang')
                };
            if(endpoint === me.endpoints.revocation){
                headers['Authorization'] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`
            }else{
                data['client_id'] = clientId;
                data['client_secret'] = clientSecret;    
            }
            return Http.post(
                URI.get(me.remoteController, endpoint, true),
                data, 
                headers
            );
        }
    },

    /**
     * 移除全部缓存令牌数据
     */
    removeAllStorageItem(){
        Object.keys(this.storageKeys).forEach(key=>{
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
            console.error(err, savedNonce, nonceInState);
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

    getTokenFromCodeSuccess(response){
        let me = this;
        me.processToken(response);
        me.fireEvent('loginsuccess');
    },

    getTokenFromCodeFailure(response){
        let me = this,
            current = I18N.getCurrentLanguage() || 'zh-CN',
            msg = AppConfig.loginFailure[current];
        MsgBox.alert('' , msg);
        me.fireEvent('loginfailtre');
    },

    createLoginUrl() {
        let me = this,
            redirectUri = me.redirectUri,
            nonce = me.createAndSaveNonce(),
            state = nonce,
            seperationChar = me.loginUrl.indexOf('?') > -1 ? '&' : '?';
        let scope = AppConfig.oAuthConfig.scope;
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
    },

    
});
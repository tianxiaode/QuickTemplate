Ext.define('Common.shared.service.OAuth', {
    alternateClassName: 'AuthService',
    singleton: true,


    requires:[
        'Common.shared.service.Localized',
    ],

    /**
     * 验证是否已认证
     * 验证方式为access_token是否存在，且是否已过期
     */
    isAuthenticated(){
        const me = this,
            storage = StorageService,
            keys = me.storageKeys,
            token = storage.get(keys.accessToken);
        if(token){
            const expiresAt = storage.get(keys.expiresAt),
                now = new Date(),
                isAuthenticated = expiresAt && parseInt(expiresAt, 10) > now.getTime();
            //如果token已过期，清除全部数据
            if(!isAuthenticated) me.removeAllStorageItem();
            me.setCurrentOrganizationUnit(Ext.decode(storage.get(keys.currentOrganizationUnit),true));
            me.organizationUnits = Ext.decode(storage.get(keys.organizationUnits),true);
            console.log(me.currentOrganizationUnit, me.organizationUnits);
            return isAuthenticated;
        }
        return false;
    },

    /**
     * 登录
     * 通过用户名/邮箱/手机和密码获取access_token
     * @param {用户名} username 
     * @param {密码} password 
     */
    login(username, password){
        const me = this,
            data = {
                'grant_type': 'password',
                'scope': me.scopes,
                'username': username,
                'password': password,
            };
        let promise = me.send(data, me.endpoints.token);
        promise.then(me.loginSuccess, null,null, me)
        return promise;
    },

    /**
     * 退出
     * 需要注销access_token和refresh_token并移除存储数据
     */
    logout(){
        const me = this,
            storage = StorageService,
            keys = me.storageKeys,
            tokenKey = keys.accessToken,
            refreshTokenKey = keys.refreshToken,
            token = storage.get(tokenKey),
            refreshToken = storage.get(refreshTokenKey);
        if(token){
            const data = {
                'token' : token,
                'token_type_hint': tokenKey
                };
            me.send(data, me.endpoints.revocation);
        }
        if(refreshToken){
            const data ={
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
        const me = this,
            headers = {
                'Authorization' : 'Bearer ' +  StorageService.get(me.storageKeys.accessToken),
                //'Access-Control-Allow-Origin': '*',
                "accept-language": StorageService.get('lang')
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
            const me = this,
                obj = me.processToken(response);
            Ext.fireEvent('loginsuccess', obj);
        },

        /**
         * 刷新令牌
         * @param {组织编号} organizationUnitId 
         */
        refreshToken(id, name){
            Ext.Viewport.setMasked(Ext.String.format(I18N.get('RefreshToken'), name));
            const me = this,
                data = {
                    'grant_type': 'refresh_token',
                    'refresh_token': StorageService.get(me.storageKeys.refreshToken),
                    'scope': me.scopes,
                    'organizationUnitId': id
                };
            const promise = me.send(data, me.endpoints.token)
            promise.then(me.refreshTokenSuccess, me.getTokenFailure, null, me);
            return promise;
        },
    
        /**
         * 
         * @param {获取令牌的结果} response 
         */
        refreshTokenSuccess(response){
            Ext.Viewport.setMasked(false);
            const me = this,
                obj = me.processToken(response);
            //发送登录已完成事件
            Ext.fireEvent('refreshtokensuccess', obj);
        },

        /**
         * 处理令牌成功
         * @param {获取令牌的结果} response 
         */
        processToken(response){
            let obj  = Ext.decode(response.responseText,true);
            if(!obj) {
                MsgBox(I18N.getDefaultMessageTitle(), I18N.getUnknownError());
                return;
            }
            const me = this,
                storage = StorageService,
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
            const me = this,
                clientId = AppConfig.oAuthConfig.clientId,
                clientSecret = AppConfig.oAuthConfig.dummyClientSecret,
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "accept-language": StorageService.get('lang')
                };
            if(endpoint === me.endpoints.revocation){
                headers['Authorization'] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`
            }else{
                data['client_id'] = clientId;
                data['client_secret'] = clientSecret;    
            }
            return Ext.Ajax.request({
                url: URI.get(me.remoteController, endpoint,null, true),
                withoutAuthorizationHeader: true,
                method: 'POST',
                rawData: Ext.Object.toQueryString(data),                
                headers: headers,
            });
        }
    },

    /**
     * 移除全部缓存令牌数据
     */
    removeAllStorageItem(){
        Object.keys(this.storageKeys).forEach(key=>{
            StorageService.remove(this.storageKeys[key]);
        })
    },

    
});
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
        if(!token) return false;
        let expireInSeconds = storage.get(keys.expireInSeconds),
            now = new Date(),
            isAuthenticated = expireInSeconds && parseInt(expireInSeconds, 10) > now.getTime();
        //如果token已过期，清除全部数据
        if(!isAuthenticated) me.removeAllStorageItem();
        return isAuthenticated;
    },

    /**
     * 登录
     * 通过用户�?/邮箱/手机和密码获取access_token
     * @param {用户名} username 
     * @param {密码} password 
     */
    login(username, password){
        let me = this,
            data = {
                'userNameOrEmailAddress': username,
                'password': password,
            };
        let promise = me.send(data, 'TokenAuth/Authenticate');
        promise.then(me.loginSuccess, null,null, me)
        return promise;
    },




    /**
     * 退�?
     * 需要注销access_token和refresh_token并移除存储数�?
     */
    logout(){
        this.removeAllStorageItem();
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

    /**
     * 刷新令牌
     * @param {组织编号} organizationUnitId 
     */
        refreshToken(id, name){
        Ext.Viewport.setMasked(Ext.String.format(I18N.get('RefreshToken'), name));
        let me = this,
            data = {
                'organizationUnitId': id
            };
        let promise = me.send(data, 'TokenAuth/AuthenticateOrganizationUnit')
        promise.then(me.refreshTokenSuccess, me.getTokenFailure, null, me);
        return promise;
    },

    getEncToken(){
        let me = this,
            storage = AppStorage;
        return storage.get(me.storageKeys.encryptedAccessToken);
    },


    privates:{

        storageKeys:{
            accessToken: 'access_token',
            encryptedAccessToken: 'encryptedAccessToken',
            expireInSeconds: 'expireInSeconds',
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
            let data = obj.result;
            let me = this,
                storage = AppStorage,
                keys = me.storageKeys,
                now = new Date(),
                expireInSeconds = now.getTime() + (data.expireInSeconds || 0) * 1000;
            storage.set(keys.accessToken, data.accessToken);
            storage.set(keys.expireInSeconds, expireInSeconds, true);
            storage.set(keys.encryptedAccessToken, data.encryptedAccessToken);
            return obj;
        },
    
        /**
         * 获取令牌失败，显示异常
         * @param {获取令牌结果} response 
         */
        getTokenFailure(response){
            return Failure.ajax.apply(this, [response, null, true]);
        },

        /**
         * 发送请求
         * @param {要发送的数据} data 
         * @param {端点} endpoint 
         */
        send(data, endpoint){
            let me = this;
            return Http.post(
                URI.get(endpoint),
                data
                //headers
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


});
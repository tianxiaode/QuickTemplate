Ext.define('Common.Desktop.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.viewport',

    routes: {
        //'*': 'onRouteChange'
        '*': 'onNoLoginRouteChange'
    },

    defaultHash: 'admindashboard',
    /**
     * 正常登录操作使用该路由
     */
    onRouteChange(){
        let me = this, 
            token = HEADERS.getAuthToken(),
            xtype = me.getHash(),
            isGlobalPages  = me.isGlobalPages(xtype);
        me.removeSplash();
        //如果已登录
        if(!Ext.isEmpty(token)){
            let homeView = me.getView().down('homeview');
            //如果主视图已渲染，且要显示的不是全局页，则在主视图切换视图
            if(homeView && !isGlobalPages){
                DialogManager.closeLasView();
                homeView.getController().setCurrentView(Ext.isEmpty(xtype) ? me.defaultHash : xtype);
                return;
            }

            //如果主视图未渲染， 且要显示的是非全局页,则加载状态,显示主视图
            if(!isGlobalPages){
                me.restoreSession().then(Ext.bind(me.initiateSession,me), Ext.bind(me.terminateSession));
                return;
            }

            //如果主实体已渲染，显示的是登录页，导航到首页
            if(xtype.toLocaleLowerCase() === 'login'){
                me.redirectTo(me.defaultHash);
                return;
            }
            //如果主实体已渲染，但要显示全局页，直接显示页面
            DialogManager.show(xtype.toLocaleLowerCase());
            return;
        }

        //如果未登录,且显示的是全局页面,则显示全局页面
        if(isGlobalPages) {
            DialogManager.show(xtype.toLocaleLowerCase());
            return;
        }

        //如果未登录，要显示的不是全局页面，显示登录页面
        me.redirectTo('login');

    },

    /**
     * 不登录时使用该路由
     */
    onNoLoginRouteChange(){
        let me = this, 
            xtype = me.getHash(),
            homeView = me.getView().down('homeview');
        if(!homeView) {
            me.removeSplash();
            me.showMainView();
            return;
        };
        homeView.getController().setCurrentView(Ext.isEmpty(xtype) ? me.defaultHash : xtype);
    },

    /**
     * 判断视图是否登录、忘记密码、重置密码、page404或page500等页面
     * @param {组件的xtype} xtype 
     */
    isGlobalPages(xtype){
        return DialogManager.globalPages.includes(xtype.toLocaleLowerCase());
    },

    /**
     * 获取访问地址hash值
     */
    getHash(){
        var hash = window.location.hash.substr(1) || '',
            index = hash.indexOf('?');
        if(index>=0) hash = hash.substr(0,index);
        return hash;
    },

    /**
     * 程序启动程序
     */
    onLaunch: function() {
        let me =this,
            hash = me.getHash();
        if(Ext.isEmpty(hash)){
            me.removeSplash();
            //需要登录
            //me.onRouteChange();
            
            //不需要登录
            me.showMainView();
        }
                
    },


    /**
     * 移除加载等待信息
     */
    removeSplash: function () {
		Ext.getBody().removeCls('launching')
        let elem = document.getElementById("splash")
        if(elem)
		    elem.parentNode.removeChild(elem)
    },
    
    /**
     * 显示主视图
     */
    showMainView: function(){
        var me = this;
        me.getView().add({xtype: 'homeview', listeners: { painted: me.onHomeViewPainted, scope: me }});

    },

    /**
     * 在主视图渲染后，根据hash值显示子视图
     * @param {触发painted时间的组件} sender 
     */
    onHomeViewPainted(sender){
        var me = this,
            hash = me.getHash();
        sender.getController().setCurrentView(Ext.isEmpty(hash) ? me.defaultHash : hash);
    },


    /**
     * 获取用户登录信息
     */
    restoreSession() {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: URI.get('Session', 'GetCurrentLoginInformations'),
                success: function (response) {
                    resolve(response);
                },
   
                failure: function (response) {
                    reject(response);
                }
            });
        });
    },

    /**
     * 初始化操作
     * @param {获取用户登录信息返回的数据} response 
     */
    initiateSession(response){
        let me = this,
            obj = Ext.decode(response.responseText, true);
        if(obj.success){
            result = obj.result;
            if (Ext.isEmpty(result.user)) {
                me.showLogin();
                return;
            }
            let store = Ext.StoreMgr.lookup('NavigationTree'),
                root = store.getRoot();
            //如果全局配置对象需要进行数据配置，可以在位置对象内定义init方法进行初始
            //CFG.init();

            //将服务器返回的用户信息复制到全局配置对象
            Ext.apply(CFG, result);

            //将服务器返回的权限定义复制到ACL对象
            ACL.setAllPermissions(CFG.auth.allPermissions);

            //将用户的权限信息复制到ACL对象
            ACL.setGrantedPermissions(CFG.auth.grantedPermissions);

            //将服务器返回的用户菜单添加到菜单栏
            root.appendChild(result.menus);

            //初始化枚举数据
            Enums.init();
            //Ext.StoreMgr.lookup('EnumsStore').load();

            //加载用户状态
            //STATE.launch();

            //连接signalR
            SR.connect();
            SR.autoConnect = true;

            //显示主视图
            me.showMainView();
            return;
        }
        me.showLogin();
    },

    terminateSession: function(response){
        FAILED.ajax(response);
    },

});
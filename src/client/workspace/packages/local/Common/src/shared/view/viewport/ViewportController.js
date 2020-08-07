Ext.define('Common.shared.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.shared-viewport',

    requires:[
        'Common.shared.view.pages.Page404',
    ],

    onLaunch(){
        const me = this;
        me.removeSplash();
        me.showGlobalView('homeview');
        //me.getView().setMasked(I18N.getLocalText('LoadingUserConfiguration'));
        //Ext.on('refreshtokensuccess', me.refreshTokenSuccess, me);
       // Ext.on('configisready', me.loadConfigurationSuccess, me)
        //if(ConfigService.isReady) me.loadConfigurationSuccess();
    },

    routes:{
        '*': 'onRouteChange'
    },

    /**
     * 路由处理
     */
    onRouteChange(){
        const me = this;
        // if(!ConfigService.isReady){
        //     return;
        // }

        const app = Ext.app.Application.instance,
            appName = app.getName().toLowerCase(),
            history = Ext.History,
            xtype = history.getToken() || '',
            isAuthenticated = ConfigService.isAuthenticated();
        
        // console.log(isAuthenticated)

        // //未认证
        // if(!isAuthenticated){
        //     //进入登录流程
        //     me.login();
        //     return;
        // }

        // //已认证
        // if(xtype === 'login') {
        //     me.redirectTo(app.getDefaultToken());
        //     return;
        // }

        const xtypeL = xtype.toLowerCase();
        let cls = Ext.ClassManager.getByAlias(`widget.shared-${xtypeL}`) 
            || Ext.ClassManager.getByAlias(`widget.${appName}-${xtypeL}`);

        // if(!cls){
        //     //视图不存在，跳转到404视图
        //     me.redirectTo('page404');
        //     return;
        // }

        // //如果是全局视图,显示全局视图
        // if(cls && cls.prototype.isGlobalView ){
        //     me.showGlobalView(cls.prototype.xtype);
        //     return;
        // }

        me.showView(cls.prototype.xtype);

    },


    privates:{

        /**
         * 显示全局视图
         * @param {类} cls 
         */
        showGlobalView(xtype){
            let vp = this.getView(),
                view = vp.down(xtype);
            if(!view){
                view =vp.add({xtype: xtype});
            };
            vp.setActiveItem(view);
        },


        /**
         * 移除加载信息
         */
        removeSplash: function () {
            Ext.getBody().removeCls('launching')
            let elem = document.getElementById("splash")
            if(elem)
                elem.parentNode.removeChild(elem)
        },

        /**
         * 显示视图
         * @param {类} cls 
         */
        showView(xtype){
            const me = this;
            //桌面的处理方式
            if(Ext.platformTags.desktop){
                const homeView = me.getView().down('homeview');
                me.getView().setActiveItem(homeView);
                homeView.getController().setCurrentView(xtype);
                return;
            }
            //移动设备的处理方式
            me.showGlobalView(xtype);
        },

        login(){
            //显示登录视图
            const me = this;
            me.showGlobalView('shared-login');
            Ext.on('loginsuccess', me.LoginSuccess, me);
        },
    
        LoginSuccess(){   
            //显示选择组织视图         
            const me = this;
            me.showGlobalView('shared-selectorganizationunit');
            me.getStore('organizationunitofaccount').load();
        },
    
        refreshTokenSuccess(){
            const me = this;
            me.getView().setMasked(I18N.getLocalText('LoadingUserConfiguration'));
            ConfigService.loadConfiguration().finally(null);
        },

        loadConfigurationSuccess(){
            const me = this,
                isAuthenticated = ConfigService.isAuthenticated();
            me.getView().setMasked(false);
            if(!isAuthenticated){
                //未认证进入登录流程
                me.login();
                return;                 
            }
            me.showGlobalView('homeview');
            me.setRoutes({
                '*': 'onRouteChange'
            });
            const token = Ext.util.History.getToken();
            if(Ext.isEmpty(token)) {
                me.redirectTo(Ext.app.Application.instance.getDefaultToken());
                return;
            }
            me.onRouteChange(); 
        }

    },


        // /**
        //  * 切换组织
        //  * @param {新组织编号} newOuId 
        //  */
        // switchOrganizationUnit(newOuId){
        //     const me = this,
        //         ous = me.organizationUnits,
        //         ou = ous.find(v=>v.id === value);
        //     if(ou){
        //         me.setCurrentOrganizationUnit(ou);
        //         Ext.Viewport.setMasked(I18N.getLocalText('LoginOrganizationUnit'));
        //         me.refreshToken(ou.id);
        //         return;
        //     }
        //     MsgBox.alert(I18N.getDefaultMessageTitle(), I18N.getLocalText('OrganizationUnitNotExist'));
        // },

    

});
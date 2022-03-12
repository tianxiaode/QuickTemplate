Ext.define('Common.view.home.HomeController',{
    extend: 'Ext.app.ViewController',

    requires:[
        'Common.service.Template',
        'Common.view.authentication.Login',
        'Common.view.pages.Page404',
        'Common.service.AccessControl',
        'Common.util.Enums',
        'Common.util.ViewManager',
        'Common.view.authentication.SelectOrganization',
        'Common.service.SignalR',
    ],

    currentToken: null,

    routes: {
        'login|forgotpassword|selectorganization': {
            action:'onShowPages',
            caseInsensitive: true,
        },
        ':xtype': {
            before: 'onBeforeHandleRoute',
            action: 'handleRoute',
        },
        'resetpassword:params':{
            action:'onShowResetPassword',
            conditions:{
                ':params': '([\\w\\W]*)'
            } 
        },
        ':xtype/:id':{
            action: 'onShowDialog'
        },

    },


    init(){
        let me = this;
        me.getView().setMasked(I18N.getLocalText('LoadingUserConfiguration'));
        Config.on('ready', me.onConfigReady, me);
        Config.loadConfiguration();
    },


    onShowResetPassword(){
        ViewMgr.showPage(ViewMgr.pages.resetpassword);
    },

    onBeforeHandleRoute(xtype, action){
        if(/^login|forgotpassword|selectorganization$/i.test(xtype)) return;
        action.resume();
    },

    handleRoute(xtype){
        let me = this,
            view = me.getView(),
            isAuthenticated = Config.isAuthenticated();
        if(!ViewMgr.pages.hasOwnProperty(xtype)) {
            me.onHideLastView();
            me.currentToken = xtype;
        }

        if(!isAuthenticated) return;

        view.setMasked(false);

        if(Ext.isEmpty(xtype)){
            ViewMgr.showPage(ViewMgr.pages.page404);
            return;
        }

        //如果是显示首页，调整到默认页
        if(xtype.toLowerCase() === 'homeview'){
            let defaultToke = Ext.getApplication().getDefaultToken();
            Ext.History.add(defaultToke, true);
            me.handleRoute(defaultToke);
            return;
        }

        Ext.Viewport.setActiveItem(view);
        me.setCurrentView(xtype);
    },


    onConfigReady() {
        let me = this,
            vm = me.getViewModel(),
            isAuthenticated = Config.isAuthenticated(),
            token = Ext.History.getToken();
        me.getView().setMasked(false);
        vm.set('isAuthenticated', isAuthenticated);

        if(token.includes('forgot') || token.includes('resetpassword')) return;

        //未登录
        if(!isAuthenticated){
            Ext.History.add('login', true);
            return;
        };

        //已登录未选择组织
        if(!Config.isOrganizationAuthenticated()){
            Ext.History.add('selectorganization', true);
            return;
        }



        token = me.currentToken;
        if(Ext.isEmpty(token)) token = Ext.getApplication().getDefaultToken();

        me.initView();
        Ext.History.add(token, true);
        me.handleRoute(token);
        Config.initEnv();
    },

    initView: Ext.emptyFn,

    setCurrentView: Ext.emptyFn,

    show404Page(){
        ViewMgr.showPage(ViewMgr.pages.page404);
    },

    onLogout() {
        Ext.Msg.confirm(I18N.get('Logout'), I18N.get('LogoutMessage'),(btn)=>{
            if(btn === 'yes'){
                Config.clearAll();
                Auth.logout();
                window.location.href = '.';
            }
        })
    },


    onShowDialog(xtype, op){
        let me = this,
            params = ViewMgr.getParams(xtype),
            container = Ext.platformTags.phone ? me.getView() : null;
        if(Ext.Object.isEmpty(params)) {
            Ext.History.back();
            return;
        }
        me.currentToken = Ext.History.getToken();
        let view = ViewMgr.showView(xtype,params.type, params.config, true, container);
        if(op === 'detail' && params.record) view.setRecord(params.record);
    },

    onHideLastView(){
        let me = this,
            token = me.currentToken;
        if(Ext.isEmpty(token)) return;
        let index = token.indexOf('/');
        if(index<0) return;
        let xtype = token.substring(token, index),
            params = ViewMgr.getParams(xtype),
            view = ViewMgr.getView(xtype, params.type);
        if(view) view.setHidden(true);
    },

    onShowPages(){
        let me = this;
            xtype = Ext.History.getToken();
        if(xtype === 'login'){
            if(Config.isOrganizationAuthenticated()){
                me.redirectTo(me.currentToken || Ext.getApplication().getDefaultToken());
                return;    
            }
            if(Config.isAuthenticated()){
                me.redirectTo('selectorganization');
                return;
            }
        }
        if(xtype === 'selectorganization' && Config.isOrganizationAuthenticated()){
            me.redirectTo(me.currentToken || Ext.getApplication().getDefaultToken());
            return;
        }
        ViewMgr.showPage(xtype);
    }
})
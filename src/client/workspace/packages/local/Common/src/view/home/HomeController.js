Ext.define('Common.view.home.HomeController',{
    extend: 'Ext.app.ViewController',

    requires:[
        'Common.service.Template',
        'Common.view.pages.Page404',
        'Common.service.AccessControl',
        'Common.service.Enums',
        'Common.service.ViewManager',
        'Common.service.SignalR',
    ],

    currentToken: null,

    routes: {
        ':xtype': {
            action: 'handleRoute',
        },
        ':xtype/:id':{
            action: 'onShowDialog'
        },

    },


    init(){
        let me = this;
        if(!Auth.isAuthenticated()){
            Auth.login();
            return;
        }
        me.loadConfiguration();
    },


    handleRoute(xtype){
        let me = this,
            view = me.getView(),
            isAuthenticated = Auth.isAuthenticated();
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


    loadConfiguration() {
        
        let me = this,
            vm = me.getViewModel(),
            isAuthenticated = Config.isAuthenticated(),
            token = Ext.History.getToken();
        me.getView().setMasked(false);
        vm.set('isAuthenticated', isAuthenticated);

        Config.loadConfiguration();
        I18N.loadResources();
        Enums.init();
        //Signalr.connect();


        me.initView();
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
        let xtype = Ext.History.getToken();
        ViewMgr.showPage(xtype);
    }
})
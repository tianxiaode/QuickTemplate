Ext.define('Common.view.home.HomeController',{
    extend: 'Ext.app.ViewController',

    requires:[
        'Common.service.View'
    ],

    currentToken: null,

    routes: {
        ':page':{
            action: 'showPage',
            conditions: {
                ':page': '(page404|login|welcome)?'
            }        
        },        
        ':xtype': {
            before : 'onBeforeRoute',
            action: 'handleRoute',
        },
        ':xtype/:id': {
            before : 'onBeforeRoute',
            action: 'onShowDialog',
        }
    },

    onBeforeRoute(hash, action){
        Logger.debug(this.onBeforeRoute, hash, action);
        
        let me = this;
        if(ViewService.pages[hash]) {
            action.stop();
            return;
        }

        let logout = AppStorage.get('logout');
        if(logout){
            action.stop();
            AppStorage.remove('logout');
            return me.redirectTo('welcome');
        }

        Auth.isAuthenticated().then(
            ()=>{
                if(me.isLoadConfiguration){
                    action.resume();
                    return;
                }
                me.onLoggedIn(action);
            }, 
            ()=>{
                action.stop();
                Auth.login();
            }
        );

    },

    isLoadConfiguration: false,
    
    showPage(xtype){
        Logger.info(this.showPage, xtype);
        ViewService.showPage(xtype);
    },

    handleRoute(xtype){
        Logger.info(this.handleRoute, xtype);
        let me = this,
            view = me.getView();

        view.setMasked(false);

        if(Ext.isEmpty(xtype)){
            ViewService.showPage(ViewService.pages.page404);
            return;
        }

        //如果是显示首页，调整到默认页
        if(xtype.toLowerCase() === ViewService.homeViewXtype){
            let defaultToke = me.getDefaultToken();
            Ext.History.add(defaultToke, true);
            me.handleRoute(defaultToke);
            return;
        }

        Ext.Viewport.setActiveItem(view);
        me.setCurrentView(xtype);
    },

    onLoggedIn(action){
        let me = this,
            vm = me.getViewModel();
        vm.set('isAuthenticated', true);
        Ext.Viewport.setMasked(I18N.getLocalText('LoadingUserConfiguration'));
        Promise.all([Config.loadConfiguration(), I18N.loadResources()]).then(
            ()=>{
                Ext.Viewport.setMasked(null);
                me.isLoadConfiguration = true;
                ACL.init();
                action.resume();
            },
            () =>{
                alert.error(I18N.getLocalText('LoadingLocalizedError'));
                Ext.Viewport.setMasked(null);
            }
        );
    },
    
    setCurrentView: Ext.emptyFn,

    getDefaultToken(){
        return Ext.getApplication().getDefaultToken();
    },

    show404Page(){
        ViewService.showPage(ViewService.pages.page404);
    },

    onShowDialog(xtype, op){
        let isEdit = op !== 'add';

        // let me = this,
        //     params = ViewMgr.getParams(xtype),
        //     container = Ext.platformTags.phone ? me.getView() : null;
        // if(Ext.Object.isEmpty(params)) {
        //     Ext.History.back();
        //     return;
        // }
        // me.currentToken = Ext.History.getToken();
        // let view = ViewMgr.showView(xtype,params.type, params.config, true, container);
        // if(op === 'more' && params.record) {
        //     view.setRecord(params.record);
        // };
    },

    onShowPages(){
        let xtype = Ext.History.getToken();
        ViewMgr.showPage(xtype);
    },

    doDestroy(){
        let me = this;
    }
})
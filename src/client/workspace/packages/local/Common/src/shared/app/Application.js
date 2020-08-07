Ext.define('Common.shared.app.Application', {
    extend: 'Ext.app.Application',

    name: 'CommonShared',

    requires:[
        'Common.shared.view.viewport.ViewportController',
        'Common.shared.view.viewport.ViewportModel'
    ],

    viewport:{
        controller: 'shared-viewport',
        viewModel: 'shared-viewport'
    },

    init: function() {
        //Ajax提交时，注入认证头
        Ext.Ajax.on('beforerequest', this.onAjaxBeforeRequest, this);
        //桌面应用允许用户选择文字
        if(Ext.platformTags.desktop){
            Ext.Viewport.setUserSelectable({
                element: true,
                bodyElement: true
            })    
        }

        //简化代码书写
        window.Ajax = Ext.bind(Ext.Ajax.request, Ext.Ajax);
        window.Format= Ext.util.Format;
    },

    onAppUpdate() {
        const title = AppConfig.applicationUpdate[AppConfig.lang] || AppConfig.applicationUpdate["en"],
            message = AppConfig.applicationUpdateMessage[AppConfig.lang] || AppConfig.applicationUpdateMessage["en"];
        Ext.Msg.confirm(title, message,
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    launch(){
        //完成应用程序初始化再进行Viewport的初始化
        Ext.Viewport.getController().onLaunch();
    },

    onAjaxBeforeRequest(conn , options , eOpts ){
        if(options.withoutAuthorizationHeader) return;
        if(!options.headers) options.headers = {}
        Ext.apply( options.headers,  AuthService.getAuthorizationHeader());
    },


});

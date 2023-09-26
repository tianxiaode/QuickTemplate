Ext.define('Common.ux.app.Application', {
    extend: 'Ext.app.Application',

    name: 'CommonShared',

    requires:[
        'Common.overrides.*',
        'Common.service.Storage',
        'Common.service.Url',
        'Common.service.HttpClient',
        'Common.service.Localized',
        'Common.service.Config',
        'Common.service.oauth.*',
        'Common.util.Format',
        'Common.ux.dataview.Format',
        'Common.service.Template',
        'Common.view.pages.Page404',
        'Common.service.AccessControl',
        'Common.service.Enums',
        'Common.service.ViewManager',
        'Common.service.SignalR',
        'Common.ux.MessageBox',
        'Common.ux.Toast'
    ],


    responsiveConfig:{
        desktop:{
            quickTips: true,
        },
    },

    viewport:{
        items:[
            // {
            //     xtype: 'homeview'
            // }
        ]
    },

    init() {
        //桌面应用允许用户选择文字
        if(Ext.platformTags.desktop){
            Ext.Viewport.setUserSelectable({
                element: true,
                bodyElement: true
            })    
        }

        if(AppConfig.logError){
            window.onerror = (msg, url, line, col, error)=>{
                Http.postScriptError(msg, url, line, col, error);
            }
        }
               
    },

    onAppUpdate() {
        let title = AppConfig.applicationUpdate[AppConfig.lang] || AppConfig.applicationUpdate["en"],
            message = AppConfig.applicationUpdateMessage[AppConfig.lang] || AppConfig.applicationUpdateMessage["en"];
        MsgBox.confirm(title, message,
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    launch(){
        //完成应用程序初始化再进行Viewport的初始化
        this.removeSplash();
    },

    /**
    * 移除加载信息
    */
    removeSplash() {
        Ext.getBody().removeCls('launching')
        let elem = document.getElementById("splash")
        elem && elem.parentNode.removeChild(elem)
    }
    


});

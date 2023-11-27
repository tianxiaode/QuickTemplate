Ext.define('Common.app.Application', {
    extend: 'Ext.app.Application',

    name: 'CommonShared',

    requires:[
        'Common.overrides.*',
        'Common.core.*',
        'Common.localized.*',
        'Common.view.page.Page404'
    ],


    responsiveConfig:{
        desktop:{
            quickTips: true,
        },
    },

    viewport:{
        items:[
            {
                xtype: 'page404'
            }
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
        Ext.getBody().removeCls('launching');
        let elem = document.getElementById("splash");
        elem && elem.parentNode.removeChild(elem);
    }
    


});

Ext.define('Common.app.Application', {
    extend: 'Ext.app.Application',

    name: 'CommonShared',

    requires:[
        'Common.core.util.Format',
        'Common.service.Template',
        'Common.core.service.Config',
        'Common.core.service.AccessControl',
        'Common.localized.Localized',
        'Common.view.page.Page404',
        'Common.view.page.Login',
        'Common.view.page.Welcome',
        'Common.service.Authentication'
    ],


    responsiveConfig:{
        desktop:{
            quickTips: true,
        },
    },

    viewport:{
        items:[
            {
                xtype: 'homeview'
            }
        ]
    },

    init() {
        Logger.debug(this.init, 'dddd')
        //桌面应用允许用户选择文字
        if(Ext.platformTags.desktop){
            Ext.Viewport.setUserSelectable({
                element: true,
                bodyElement: true
            })    
        }
        I18N.loadResources();      
        window.Auth = Ext.create('service.authentication');
    },

    onAppUpdate() {
        Logger.debug(this.onAppUpdate, 'dddd')
        let title = I18N.getLocalText('applicationUpdate'),
            message = I18N.getLocalText('applicationUpdateMessage');
        MsgBox.confirm(title, message,
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    launch(){
        Logger.debug(this.launch, 'dddd')
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

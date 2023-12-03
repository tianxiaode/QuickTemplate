Ext.define('Common.app.Application', {
    extend: 'Ext.app.Application',

    name: 'CommonShared',

    requires:[
        'Common.core.service.Config',
        'Common.localized.Localized',
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
                xtype: 'homeview'
            }
        ]
    },

    init() {
        I18N.loadResources();
        //桌面应用允许用户选择文字
        if(Ext.platformTags.desktop){
            Ext.Viewport.setUserSelectable({
                element: true,
                bodyElement: true
            })    
        }
      
    },

    onAppUpdate() {
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

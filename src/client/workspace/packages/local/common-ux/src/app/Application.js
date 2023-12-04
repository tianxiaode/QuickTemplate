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

    // viewport:{
    //     items:[
    //         {
    //             xtype: 'homeview'
    //         }
    //     ]
    // },

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
        let me = this;
        //完成应用程序初始化再进行Viewport的初始化
        this.removeSplash();
        window.Auth = Ext.create('service.authentication');

        Auth.isAuthenticated().then(me.onLoggedIn, Auth.login.bind(Auth));
    },

    onLoggedIn(){
        Ext.Viewport.setMasked({ message: I18N.getLocalText('LoadingUserConfiguration')});
        Promise.all([Config.loadConfiguration(), I18N.loadResources()]).then(
            ()=>{
                Ext.Viewport.setMasked(null);
                Ext.Viewport.add({ xtype: 'homeview' });
            },
            () =>{
                alert.error(I18N.getLocalText('LoadingLocalizedError'));
                Ext.Viewport.setMasked(null);
            }
        );
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

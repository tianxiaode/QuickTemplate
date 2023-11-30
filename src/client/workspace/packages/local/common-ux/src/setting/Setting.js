Ext.define('Common.setting.Setting',{
    alternateClassName: 'AppSetting',
    singleton: true,

    //oidc设置
    authority: 'https://localhost:44320/',
    issuer: 'http://localhost:4200',
    redirectUri: "http://localhost:4200/desktop",
    clientId: 'QuickTemplate_App',
    scope: 'offline_access QuickTemplate',
    responseType: 'code',


    //调试设置
    debug: true,
    logError: false,
    loggerLevel: null,

    //功能设置
    xsrfCookieName: 'XSRF-TOKEN',
    //xsrfHeaderName: 'X-XSRF-TOKEN',
    xsrfHeaderName: 'RequestVerificationToken',
    language: null,
    useLocalStorage: true,
    isLogScriptError: false,

    //应用设置
    companyUrl: 'http://localhost:44320',
    copyrightStartValue: '2020',
    icp: '粤ICP备2022031812号',
    companyFullName: {
        "en": 'Quick Template',
        "zh-CN": '快速模板'
    },
    companyShortName:{
        "en": 'Quick Template',
        "zh-CN": '快速模板'
    },
    desktop:{

    },
    phone:{

    },


    constructor(){
        let me = this;
        if(me.isLogScriptError){
            window.onerror = (msg, url, line, col, error)=>{
                Http.postScriptError(msg, url, line, col, error);
            }
        }
        if(me.loggerLevel){
            Logger.setLevel(appConfig.loggerLevel);
        }
    
    },


    destroy() {
        let me = this;
        me.destroyMembers('desktop', 'phone', 'companyFullName');        
        me.callParent();
    },



})
window.AppConfig = {
    currentLoadingText: '',

    //oidc设置
    authority: 'https://www.extjs.tech/',
    clientId: 'QuickTemplate_App',
    scope: 'offline_access QuickTemplate',
    responseType: 'code',


    //调试设置
    debug: true,
    logError: false,
    loggerLevel: 'debug',

    //服务器设置
    //预防验证服务器与api服务器是分离的
    server: 'https://localhost:44320/',
    xsrfCookieName: 'XSRF-TOKEN',
    //xsrfHeaderName: 'X-XSRF-TOKEN',
    xsrfHeaderName: 'RequestVerificationToken',
    language: null,
    useLocalStorage: true,
    isLogScriptError: false,

    //应用设置
    loggerLevel: 'debug',
    companyUrl: 'http://localhost:44320',
    copyrightStartValue: '2020',
    icp: '粤ICP备2022031812号',
    companyFullName: {
        "en": 'Quick Template',
        "zh-Hans": '快速模板'
    },
    companyShortName:{
        "en": 'Quick Template',
        "zh-Hans": '快速模板'
    },
    appName:{
        en: 'Quick Template',
        "zh-Hans": '快速模板'
    },
    loadingText:{
        "en": 'Loading...',
        "zh-Hans": '加载中...'
    },
    applicationUpdateTitle: {
        "en": 'Application Update',
        "zh-CN": '更新应用程序'
    },
    applicationUpdateMessage:{
        "en": 'This application has an update, reload?',
        "zh-CN": '应用程序已更新，是否重新加载？'
    },
    desktop:{
        redirectUri: "http://d.extjs.tech",

    },
    phone:{
        redirectUri: "http://m.extjs.tech",

    },

    getLang() {
        return localStorage.getItem('lang') || 'en';
    },

    getAppName(){
        return AppConfig.appName[AppConfig.getLang()] || AppConfig.appName["en"];
    },

    getCompanyFullName(){
        return AppConfig.companyFullName[AppConfig.getLang()] || AppConfig.companyFullName["en"];
    },

    getCompanyShortName(){
        return AppConfig.companyShortName[AppConfig.getLang()] || AppConfig.companyShortName["en"];
    },

    getLoadingText(){
        return AppConfig.loadingText[AppConfig.getLang()] || AppConfig.loadingText["en"];
    },

    getApplicationUpdateTitle(){
        return AppConfig.applicationUpdateTitle[AppConfig.getLang()] || AppConfig.applicationUpdateTitle["en"];
    },

    getApplicationUpdateMessage(){
        return AppConfig.applicationUpdateMessage[AppConfig.getLang()] || AppConfig.applicationUpdateMessage["en"];
    },

};

const normalizeLang = () => {
    let lang = localStorage.getItem('lang') || navigator.language || navigator.browserLanguage;
    if (lang.toLocaleLowerCase() === 'zh-cn') lang = 'zh-Hans';
    if (lang.toLocaleLowerCase() === 'zh-tw') lang = 'zh-Hant';
    localStorage.setItem('lang', lang);
    return lang;
}

//加载语言
normalizeLang();
document.title = AppConfig.getAppName();


window.onload = () => {
    let el = document.getElementById('loadingText');
    if (el) el.innerHTML = AppConfig.getLoadingText();
}

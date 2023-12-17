window.AppConfig = {
    currentLoadingText: '',

    //oidc设置
    authority: 'https://localhost:44320/',
    clientId: 'QuickTemplate_App',
    scope: 'offline_access QuickTemplate',
    responseType: 'code',


    //调试设置
    debug: true,
    logError: false,
    loggerLevel: null,

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
    desktop:{
        redirectUri: "http://localhost:4200/desktop"
    },
    phone:{
        redirectUri: "http://localhost:4200/phone",
    }

};

normalizeLang = () => {
    let locale  = window.location.href.match(/lang=([\w-]+)/),
        currentLang = navigator.language || navigator.browserLanguage,
        lang = (locale && locale[1]) || currentLang; 
    if(lang.toLocaleLowerCase() === 'zh-cn') return 'zh-Hans';
    if(lang.toLocaleLowerCase() === 'zh-tw') return 'zh-Hant';
    localStorage.setItem('lang', lang);
    return lang;
}

//加载语言
let lang = AppConfig.lang = normalizeLang();
let appName = AppConfig.appName[lang] || AppConfig.appName["en"];
document.title = appName;


window.onload = () =>{
    let el = document.getElementById('loadingText');
    if(el) el.innerHTML = AppConfig.loadingText[AppConfig.lang] || AppConfig.loadingText["en"];
}

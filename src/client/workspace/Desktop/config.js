window.AppConfig = {
    apiUrl: 'https://localhost:44320/',
    localUrl: './',
    debug: true,
    lang: '',
    oAuthConfig: {
        issuer: 'http://localhost:4200',
        redirectUri: "http://localhost:4200/desktop",
        clientId: 'QuickTemplate_App',
        scope: 'offline_access QuickTemplate',
        responseType: 'code'
    },
    appName:{
        en: 'Quick Template',
        "zh-CN": '快速模板'
    },
    loadingText:{
        "en": 'Loading...',
        "zh-CN": '加载中...'
    },
    applicationUpdate: {
        "en": 'Application Update',
        "zh-CN": '更新应用程序'
    },
    applicationUpdateMessage:{
        "en": 'This application has an update, reload?',
        "zh-CN": '应用程序已更新，是否重新加载？'
    },
    currentLoadingText: '',
    logError: false
};

//加载语言
let locale  = window.location.href.match(/lang=([\w-]+)/),
    currentLang = navigator.language || navigator.browserLanguage;
window.AppConfig.lang = (locale && locale[1]) || currentLang;
let appName = window.AppConfig.appName[window.AppConfig.lang] || window.AppConfig.appName["en"];
document.title = appName;
window.setTimeout(()=>{
    let el = document.getElementById('loadingText');
    if(el) el.innerHTML = window.AppConfig.loadingText[window.AppConfig.lang] || window.AppConfig.loadingText["en"];
}, 50);

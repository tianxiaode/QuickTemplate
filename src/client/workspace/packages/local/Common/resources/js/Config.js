window.AppConfig = {
    apiUrl: 'https://localhost:44350/',
    localUrl: './',
    lang: '',
    oAuthConfig: {
        issuer: 'https://localhost:44350/',
        clientId: 'Service_App',
        dummyClientSecret: '2f372b30-c050-4630-9923-da341bc57bca',
        scope: 'Service',
        showDebugInformation: true,
        oidc: false,
        requireHttps: false
      },
    appName:{
        en: 'Sencha',
        "zh-CN": 'Sencha'
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
    currentLoadingText: ''
};

//加载语言
const locale  = window.location.href.match(/lang=([\w-]+)/),
    currentLang = navigator.language || navigator.browserLanguage;
window.AppConfig.lang = (locale && locale[1]) || currentLang;
const appName = window.AppConfig.appName[window.AppConfig.lang] || window.AppConfig.appName["en"];
document.title = appName;
window.AppConfig.currentLoadingText = window.AppConfig.loadingText[window.AppConfig.lang] || window.AppConfig.loadingText["en"];
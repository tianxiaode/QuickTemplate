let appConfig = {
    lang: null,
    appName:{
        en: 'Quick Template',
        "zh-CN": '快速模板'
    },
    loadingText:{
        "en": 'Loading...',
        "zh-CN": '加载中...'
    },
    currentLoadingText: ''
};

//加载语言
let locale  = window.location.href.match(/lang=([\w-]+)/),
    currentLang = navigator.language || navigator.browserLanguage,
    lang = appConfig.lang || (locale && locale[1]) || currentLang;
let appName = appConfig.appName[lang] || appConfig.appName["en"];
document.title = appName;
window.setTimeout(()=>{
    let el = document.getElementById('loadingText');
    if(el) el.innerHTML = appConfig.loadingText[appConfig.lang] || appConfig.loadingText["en"];
}, 50);

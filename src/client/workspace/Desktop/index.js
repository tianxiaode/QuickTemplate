'use strict';

(function(){
    window.ROOTPATH = 'http://localhost:21021/';
    window.LOCALPATH = './';
    window.CurrentDate = new Date();

    const isDebug = window.location.host.includes('localhost');
    const defaultUrl = isDebug ? '../build/development/Desktop/resources' : '';

    const js=     [
        'plupload/moxie.js',
        'plupload/plupload.dev.js',
        'signalr.js',
        'plupload/i18n/zh_CN.js'
    ];
    
    if((!!window.ActiveXObject || "ActiveXObject" in window) && !navigator.userAgent.match(/(Edge\/)([\w.]+)/) ){
        //如果浏览器是IE，那么切换安装支持浏览器页面
        window.location.href = 'resources/Locale/browse.html';
    }

    //加载语言
    const locale  =location.href.match(/lang=([\w-]+)/),
        currentLang = navigator.language || navigator.browserLanguage;
    window.LANG = (locale && locale[1]) || currentLang;
    document.write(`<script src="${defaultUrl}/Locale/${LANG.replace('-','_')}.js?_dc=${(new Date()).getTime()}" type="text/javascript"><\/script>`);
    
    
    js.forEach(item=>{
            document.write(`<script src="${defaultUrl}/Common/js/${item}?_dc=${(new Date()).getTime()}" type="text/javascript"><\/script>`);
        });    
})();



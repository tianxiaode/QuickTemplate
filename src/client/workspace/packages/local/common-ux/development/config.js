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
    useLocalStorage: true,
    isLogScriptError: false,

    //应用设置
    loggerLevel: 'debug',
    companyUrl: 'http://localhost:44320',
    copyrightStartValue: '2020',
    icp: '粤ICP备2022031812号',

    desktop: {
        redirectUri: "http://localhost:4200/desktop"
    },
    phone: {
        redirectUri: "http://localhost:4200/phone",
    }

};


window.locale = {
    "en": {
        companyFullName: "Quick Template",
        companyShortName: "Quick Template",
        appName: "Quick Template",
        loadingText: "Loading...",
        applicationUpdateTitle: "Application Update",
        applicationUpdateMessage: "A new version of the application is available. Do you want to update now?",
        loadingOrganizationUnit: "Loading organization unit...",
        defaultInfoTitle: "Information",
        networkError: "Network error. Please check your internet connection and try again.",
        unknownError: "Unknown error. Please try again later.",
        loadingUserConfiguration: "Loading user configuration...",
        loadingUserConfigurationError: "Error loading user configuration. Please try again later.",
        loadingLocalized: "Loading localized strings...",
        loadingLocalizedError: "Error loading localized strings. Please try again later.",
    },
    "fr": {
        companyFullName: "Quick Template",
        companyShortName: "Quick Template",
        appName: "Quick Template",
        loadingText: "Chargement...",
        applicationUpdateTitle: "Mise à jour de l'application",
        applicationUpdateMessage: "Une nouvelle version de l'application est disponible. Voulez-vous mettre à jour maintenant?",
        loadingOrganizationUnit: "Chargement de l'unité d'organisation...",
        defaultInfoTitle: "Information",
        networkError: "Erreur de réseau. Vérifiez votre connexion internet et réessayez.",
        unknownError: "Erreur inconnue. Veuillez réessayer plus tard.",
        loadingUserConfiguration: "Chargement de la configuration utilisateur...",
        loadingUserConfigurationError: "Erreur lors du chargement de la configuration utilisateur. Veuillez réessayer plus tard.",
        loadingLocalized: "Chargement des chaînes de caractères localisées...",
        loadingLocalizedError: "Erreur lors du chargement des chaînes de caractères localisées. Veuillez réessayer plus tard.",
    },
    "es": {
        companyFullName: "Quick Template",
        companyShortName: "Quick Template",
        appName: "Quick Template",
        loadingText: "Cargando...",
        applicationUpdateTitle: "Actualización de la aplicación",
        applicationUpdateMessage: "Hay una nueva versión de la aplicación disponible. ¿Quieres actualizar ahora?",
        loadingOrganizationUnit: "Cargando unidad organizativa...",
        defaultInfoTitle: "Información",
        networkError: "Error de red. Comprueba tu conexión a internet e inténtalo de nuevo.",
        unknownError: "Error desconocido. Inténtalo de nuevo más tarde.",
        loadingUserConfiguration: "Cargando la configuración del usuario...",
        loadingUserConfigurationError: "Error al cargar la configuración del usuario. Inténtalo de nuevo más tarde.",
        loadingLocalized: "Cargando cadenas de caracteres localizadas...",
        loadingLocalizedError: "Error al cargar las cadenas de caracteres localizadas. Inténtalo de nuevo más tarde.",
    },
    "de": {
        companyFullName: "Quick Template",
        companyShortName: "Quick Template",
        appName: "Quick Template",
        loadingText: "Laden...",
        applicationUpdateTitle: "Anwendungsupgrade",
        applicationUpdateMessage: "Eine neue Version der Anwendung ist verfügbar. Möchten Sie jetzt aktualisieren?",
        loadingOrganizationUnit: "Laden der Organisationseinheit...",
        defaultInfoTitle: "Information",
        networkError: "Netzwerkfehler. Bitte überprüfe deine Internetverbindung und versuche es erneut.",
        unknownError: "Unbekannter Fehler. Bitte versuche es später noch einmal.",
        loadingUserConfiguration: "Laden der Benutzerkonfiguration...",
        loadingUserConfigurationError: "Fehler beim Laden der Benutzerkonfiguration. Bitte versuche es später noch einmal.",
        loadingLocalized: "Laden der lokalisierten Zeichenketten...",
        loadingLocalizedError: "Fehler beim Laden der lokalisierten Zeichenketten. Bitte versuche es später noch einmal.",
    },    
    "zh-Hans": {
        companyFullName: "快速模板",
        companyShortName: "快速模板",
        appName: "快速模板",
        loadingText: "加载中...",
        applicationUpdateTitle: "更新应用程序",
        applicationUpdateMessage: "应用程序有新版本可用。 现在要更新吗？",
        loadingOrganizationUnit: "正在加载组织单元...",
        defaultInfoTitle: "信息",
        networkError: "网络错误。 请坚持您的网络连接并重试。",
        unknownError: "未知错误。 请稍后再试。",
        loadingUserConfiguration: "正在加载用户配置...",
        loadingUserConfigurationError: "加载用户配置时出错。 请稍后再试。",
        loadingLocalized: "正在加载本地化字资源...",
        loadingLocalizedError: "加载本地化字资源时出错。 请稍后再试。",
    },
    "zh-Hant": {
        companyFullName: "快速模板",
        companyShortName: "快速模板",
        appName: "快速模板",
        loadingText: "載入中...",
        applicationUpdateTitle: "應用程式更新",
        applicationUpdateMessage: "應用程式有新版本可用。 現在要更新嗎？",
        loadingOrganizationUnit: "正在載入組織單位...",
        defaultInfoTitle: "資訊",
        networkError: "網絡錯誤。 請檢查您的網絡連線並重試。",
        unknownError: "未知錯誤。 請稍後再試。",
        loadingUserConfiguration: "正在載入使用者設定...",
        loadingUserConfigurationError: "載入使用者設定時發生錯誤。 請稍後再試。",
        loadingLocalized: "正在載入本地化资源...",
        loadingLocalizedError: "載入本地化字串時發生錯誤。 請稍後再試。",
    },

    getLanguage() {
        return localStorage.getItem('lang') || navigator.language || navigator.browserLanguage;
    },

    get(key) {
        return locale[locale.getLanguage() || 'en'][key] ?? '';
    },

    init() {
        let lang = localStorage.getItem('lang') || navigator.language || navigator.browserLanguage;
        if (lang.toLocaleLowerCase() === 'zh-cn') lang = 'zh-Hans';
        if (lang.toLocaleLowerCase() === 'zh-tw') lang = 'zh-Hant';
        localStorage.setItem('lang', lang);
    }
};

locale.init();
document.title = locale.get('appName');

window.onload = () => {
    let el = document.getElementById('loadingText');
    if (el) el.innerHTML = locale.get('loadingText');
}

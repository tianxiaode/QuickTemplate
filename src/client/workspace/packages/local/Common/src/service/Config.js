Ext.define('Common.service.Config', {
    alternateClassName: 'Config',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],

    config:{
        fileOptions: null,
        district: null
    },

    images:{},

    isReady: false,
    constructor(config){
        let me = this;
        me.mixins.observable.constructor.call(me, config);
        //me.loadConfiguration();
    },

    isAuthenticated(){
        let me = this;
        return me.data.user && me.data.user.id && me.data.user.id > 0;
    },

    isOrganizationAuthenticated(){
        let me = this;
        return me.data.organizationUnit 
            && me.data.organizationUnit.id  
            && me.data.organizationUnit.id > 0;
    },

    getCurrentOrganizationUnit(){
        return this.data.organizationUnit;
    },

    getCurrentUser(){
        return this.data.user;
    },

    isAdmin(){
        return this.getCurrentUser().isAdmin;
    },

    getPasswordSetting(){
        return this.data.passwordSetting;
    },

    getFileOption(key){
        let me = this,
            fileOptions = me.getFileOptions();
        return fileOptions[key];
    },

    getRealTimeSyncValue(){
        return this.data.userSetting.realTimeSync;
    },

    loadConfiguration(){
        let me = this;
        me.isReady = false;
        let promise = Http.get(URI.get('application-configuration'));
        promise.then(me.loadConfigurationSuccess,null, null ,me);
        return promise;
    },

    initEnv(){
        let me = this;
        // Enums.init();
        // District.init();
        //Signalr.connect();
    },

    hasDescriptionFeature(){
        let value = this.data.features.values['Products.Description'];
        return value && value.toLowerCase() === 'true';
    },

    getCategoryRoot(){
        return { id: -999, displayName: '全部', expanded: false, }
    },

    // loadPasswordSetting(){
    //     let me = this;
    //     Http.get(URI.crud('setting', 'password')).
    //         then(me.onLoadPasswordSettingSuccess, Failure.ajax, null, me);
       
    // },

    getImage(hash){
        if(Ext.isEmpty(hash)) return null;
        return this.images[hash];
    },

    setImage(hash, url){
        if(Ext.isEmpty(hash)) return;
        this.images[hash] = url;
    },

    checkClearingRule(){
        let me = this;
        if(!ACL.isGranted('Pages.ClearingRule.Create')) return;
        Http.get(URI.crud('ClearingRule', 'check'))
            .then(me.checkClearingRuleSuccess, me.onAjaxFailure, null, me);
    },

    clearAll(){
        let me = this;
        me.isReady = false;
        me.data = null;
    },

    privates:{
        data: {},

        loadConfigurationSuccess(response){
            let me = this;
            let obj = Ext.decode(response.responseText, true);
            if(!(obj && obj.result )){
                MsgBox.alert(null, I18N.getUnknownError());
                return;
            }
            let result = obj.result;
            me.data = Object.assign({}, result);
            me.setFileOptions(result.fileOption);
            me.isReady = true;
            me.fireEvent('ready', result);
        },

        // onLoadPasswordSettingSuccess(response){
        //     let me = this,
        //         data = Http.parseResponseText(response);
        //     me.passwordSetting = data.result;
        // },

        checkClearingRuleSuccess(response){
            let me = this;
                data = Http.parseResponseText(response).result;
            if(!Ext.isObject(data)) return;
            let resourceName = 'ClearingRules',
                html = ['<ul  class="message-tips">'];
            if(!data.hasWeChatDefault) html.push(`<li class='danger'>${I18N.get('NoWeChatDefault',resourceName)}</li>`);
            if(!data.hasAplipayDefault) html.push(`<li class='danger'>${I18N.get('NoAlipayDefault',resourceName)}</li>`);
            me.getClearingRuleExpirationHtml(html, resourceName, data.alerts, 'ExpirationByOneMonth', 'warning');
            me.getClearingRuleExpirationHtml(html, resourceName, data.warnings, 'ExpirationByDays', 'danger');
            html.push(`</ul>`);
            if(html.length>2) MsgBox.alert(null, html.join(''));
        },

        getClearingRuleExpirationHtml(html,resourceName, data, title, cls){
            if(!Ext.isArray(data)) return;            
            if(data.length === 0) return;
            html.push(`<li class='info'>${I18N.get(title,resourceName)}</li>`);
            html.push(`<ul style="list-style:none">`);
            data.forEach(m=>{
                let payText = Format.clearingType(m.type);
                    text = `${m.displayName}(${payText})`;
                html.push(`<li class="${cls}">${text}</li>`);
            });
            html.push(`</ul>`);
        }
    
    },


});

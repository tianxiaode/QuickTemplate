Ext.define('Common.service.oauth.navigators.PopupNavigator',{

    constructor(config){
        this.settings = config.settings;
    },

    async prepare(){
        let me = this;
        me.window = Ext.create('oauth.popupwindow', me.settings);
        return me.window;
    },

    async callback(url, keepOpen){
        this.window.notifyOpener(url, keepOpen);
    },

    destroy() {
        this.destroyMembers('window', 'settings');
        this.callParent();
    }


});
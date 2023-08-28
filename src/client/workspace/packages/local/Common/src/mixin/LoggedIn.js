Ext.define('Common.mixin.LoggedIn', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        before:{
            initialize: 'initialize'
        }
    },


    initialize(){
        let me = this;
        Auth.isAuthenticated() && me.onLoggedIn();
        Auth.on('loggedin', me.onLoggedIn, me);
    },

    onLoggedIn: Ext.emptyFn
});
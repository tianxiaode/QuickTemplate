Ext.define('Common.mixin.button.User', {
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.dataview.DetailList',
    ],

    config: {
        userButton: null
    },

    isEnableConfigListener: true,

    createUserButton(config) {
        let me = this;
        return Ext.apply({
            xtype: 'button',
            ui: 'grey',
            arrow: false,
            menuAlign: 'br',
            bind: {hidden: '{!isAuthenticated}'},
            menu: {
                minWidth: 400,
                anchor: true,
                resourceName: 'AbpIdentity',
                items:[
                    {
                        xtype: 'uxdetaillist',
                        itemId: 'detailList',
                        scrollable: true,
                        flex: 1,
                        fields: ['userName','name','surname', 'email', 'phoneNumber']
                    }
                ]
            },
            ownerCmp: me
        }, config);
    },

    applyUserButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createUserButton');
    },

    updateUserButton(config){
        config && this.add(config);
    },

    onConfigReady(){
        this.updateUserInfo();
    },

    updateUserInfo(){
        Logger.debug(this.updateUserInfo, 'updateUserInfo');
        let me = this,
            button = me.getUserButton(),
            list = button.getMenu().down('#detailList'),
            store = list.getStore();
        if(!store) return;
        let data = store.getData().items,
            user = Config.getCurrentUser();
        if(!user) return;
        button.setText(user.userName);
        Ext.each(data ,d=>{
            let f = d.getId();
            d.set('text', user[f]);
            d.commit();
        });
    },


    doDestroy(){
        this.destroyMembers( 'userButton');
    }


})

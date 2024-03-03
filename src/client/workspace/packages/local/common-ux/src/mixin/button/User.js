Ext.define('Common.mixin.button.User', {
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.dataview.DetailList',
    ],

    config: {
        userButton: null
    },

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
        //this.updateUserInfo();
        config && this.add(config);
    },

    updateUserInfo(){
        let me = this,
            list = me.getMenu().down('#detailList'),
            store = list.getStore();
        if(!store) return;
        let data = store.getData().items,
            user = Config.getCurrentUser();
        me.setText(user.userName);
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

Ext.define('Common.ux.button.User',{
    extend: 'Ext.Button',
    xtype: 'uxuserbutton',

    mixins:[
        'Common.core.mixin.ConfigReady'
    ],

    requires:[
        'Common.ux.dataview.DetailList',
    ],

    ui: 'header',
    arrow: false,
    menuAlign: 'br',

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
                fields: ['userName','name','surname', 'email', 'phoneNumber'],
            }
        ]
    },

    bind: {hidden: '{!isAuthenticated}'},

    onConfigReady(){
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

    doDestroy() {
        let me = this;
        me.destroyMembers('menu');
        me.callParent();
    }


})
Ext.define('Common.ux.button.user.Button',{
    extend: 'Ext.Button',
    xtype: 'uxuserbutton',

    mixins:[
        'Common.mixin.ConfigReady'
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
            },        
        ],
    },



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
    }


})
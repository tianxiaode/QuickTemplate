Ext.define('Common.ux.button.user.Button',{
    extend: 'Ext.Button',
    xtype: 'uxuserbutton',

    requires:[
        'Common.ux.dataview.DetailList'
    ],

    ui: 'header',
    arrow: false,
    menuAlign: 'br',

    config:{
        menu: {
            minWidth: 400,
            items:[
                {
                    xtype: 'uxdetaillist',
                    itemId: 'detailList',
                    scrollable: true,
                    flex: 1,
                    fields: ['userName','name', 'emailAddress', 'phoneNumber'],
                },        
            ],
        }
    },

    createMenu(newCmp) {
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },


    applyMenu(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createMenu');
    },


    initialize(){
        let me = this;
        me.callParent(arguments);
        Config.isReady && me.refreshList();
        Config.on('ready', me.refreshList, me);
    },

    refreshList(){
        let list = this.getMenu().down('#detailList'),
            store = list.getStore();
        if(!store) return;
        let data = store.getData().items,
            user = Config.getCurrentUser();
        console.log(user);
        Ext.each(data ,d=>{
            let f = d.getId();
            d.set('text', user[f]);
            d.commit();
        });    

    }

})
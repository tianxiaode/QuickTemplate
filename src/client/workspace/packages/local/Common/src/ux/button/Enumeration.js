Ext.define('Common.ux.button.Enumeration',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxenumerationbutton',

    mixins:[
        'Common.mixin.Enumeration'
    ],


    config:{
        store:{
            sorters: 'order'
        },
        menu:{
            anchor: true            
        },
        list:{
            xtype: 'list',
            flex: 1,
            minWidth: 100,
            itemTpl: `{text}`
        }
    },

    applyStore: function(store) {
        if (store) {
            store = Ext.data.StoreManager.lookup(store);
        }
        return store;
    },


    createList(newCmp) {
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            store: me.getStore(),            
            listeners:{
                select: me.onListSelect,
                scope: me
            },
        }, newCmp);
    },

    applyList(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createList');
    },

    initialize(){
        let me = this;
        me.callParent();
        me.getMenu().add(me.getList());
        me.isPhone() && me.setUi('plain');
    },

    onListSelect(sender, selected, eOpts ){
        let me = this,
            value = selected.get('value');
        me.setText(selected.get('text'));
        me.setValue(value)
        me.fireEvent('change', me, value);
    },

    dodoDestroy(){
        this.setStore(null);
        this.callParent();
    }

})

Ext.define('Common.ux.field.OnlyEmptyValues',{
    extend: 'Ext.field.Select',
    xtype: 'uxonlyemptyvaluesfield',

    initialize(){
        let me = this;
        me.callParent();
        me.initData();
    },

    initData(){
        let me = this,
            all = I18N.get('All', 'Language'),
            onlyEmpty = I18N.get('OnlyEmptyValues', 'Language'),
        data =[
            { text: all, value: false},
            { text: onlyEmpty, value: true}
        ];
        me.setOptions(data);
        me.setValue(true);
    }

})
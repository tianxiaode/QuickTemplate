Ext.define('Common.ux.multilingual.Menu',{
    extend: 'Ext.menu.Menu',
    xtype: 'uxmultilingualmenu',

    mixins:[
        'Common.ux.multilingual.mixin.List'
    ],

    layout: 'vbox',

    list:{
        cancelResponsive: true,
        readOnly: true
    },

    updateRecord(record){
        let me = this,
            list = me.getList(),
            store = record.store || record.getTreeStore(),
            field = store.messageField;
        list && list.setRecord(record);
        me.setTitle(`${I18N.get('Multilingual')}::${record.get(field)}`);
    }

})
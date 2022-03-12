Ext.define('Common.ux.field.DateStatModeSelect',{
    extend: 'Ext.field.Select',
    xtype: 'uxdatestatmodeselectfield',
    
    picker: 'floated',

    initialize(){
        let me = this;
        me.callParent();
        me.initData();
    },

    initData(){
        let me = this,
            data =[];
        data.push({ value:1, text: I18N.get('By') + I18N.get('Day')});
        data.push({ value:2, text: I18N.get('By') + I18N.get('Month')});
        data.push({ value:3, text: I18N.get('By') + I18N.get('Year')});
        me.setOptions(data);
        me.setValue(data[0].value);
    }

})
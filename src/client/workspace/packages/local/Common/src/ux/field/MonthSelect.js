Ext.define('Common.ux.field.MonthSelect',{
    extend: 'Ext.field.Select',
    xtype: 'uxmonthselectfield',

    langPlaceholder: 'Month',

    picker: 'floated',

    initialize(){
        let me = this;
        me.callParent();
        me.initSelectData();

    },


    initSelectData(){
        let me = this,
            current = new Date().getMonth() +1,
            options =[];
        Ext.Date.monthNames.forEach((name,index)=>{
            options.push({value: index+1, text: name});
        })
        me.setOptions(options);
        me.setValue(current);
    }

});

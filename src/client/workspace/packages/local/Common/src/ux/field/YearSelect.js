Ext.define('Common.ux.field.YearSelect',{
    extend: 'Ext.field.Select',
    xtype: 'uxyearselectfield',

    langPlaceholder: 'Year',

    config:{
        start: null,
        end: null
    },

    picker: 'floated',

    initialize(){
        let me = this;
        me.callParent();
        me.initSelectData();

    },


    initSelectData(){
        let me = this,
            current = new Date().getFullYear(),
            start = me.getStart() ,
            end = me.getEnd() || current,
            hasCurrent = false,
            options =[];
        if(Ext.isEmpty(start) || Ext.isEmpty(end)) return;
        for (let i = start; i <= end; i++){
            if(current === i) hasCurrent = true;
            options.push({value: i, text: i.toString()});
        }
        me.setOptions(options);
        me.setValue(hasCurrent ? current : options[options.length -1].value);
    }

});

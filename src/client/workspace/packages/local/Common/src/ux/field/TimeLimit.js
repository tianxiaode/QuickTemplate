Ext.define('Common.ux.field.TimeLimit',{
    extend: 'Common.ux.field.DatePeriod',
    xtype: 'uxtimelimit',

    requires:[
        'Ext.Responsive',
        'Ext.field.Checkbox',
        'Common.ux.field.Date'
    ],
    
    langLabel: 'TimeLimit',
    required: true,

    config:{
        longTerm:{}
    },

    updateDisabled(disabled, oldDisabled){
        let me = this,
            longTerm = me.getLongTerm(),
            timeDisabled = disabled || longTerm.getChecked();
        me.callParent([disabled, oldDisabled])
        longTerm.setDisabled(disabled);
        me.getStart().setDisabled(timeDisabled);
        me.getEnd().setDisabled(timeDisabled);
        return disabled;
    },

    createLongTerm(newCmp){
        let me = this;
        return Ext.apply({
            xtype: 'checkboxfield',
            name: 'isLongTerm',
            autoLabel: false,
            value: true,
            weight: 50,
            width:80,
            margin: '0 5px 0 0',
            checked: false,
            uncheckedValue: false,
            bodyAlign: 'start',
            langBoxLabel:  'LongTerm',
            ownerCmp: me,
            listeners:{
                change: me.onLongTermChange,
                scope: me
            }
        }, newCmp);
    },

    applyLongTerm(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createLongTerm');
    },

    updateLongTerm(config){
        config && this.add(config);
    },


    onLongTermChange(sender, newValue, oldValue, eOpts){
        let me = this,
            start = me.getStart(),
            end = me.getEnd(),
            checked = sender.getChecked();
        if(start) {
            start.setDisabled(checked);
            start.setRequired(!checked)
        };
        if(end) {
            end.setDisabled(checked)
            end.setRequired(!checked)
        };
        if(!newValue){
            let date = new Date(),
                startValue = start.getValue(),
                endValue = end.getValue();
            if(Ext.isDate(startValue) && startValue.getFullYear() === 1) start.setValue(date);
            if(Ext.isDate(endValue) && endValue.getFullYear() === 9999)  end.setValue(date);
        }
    },

    doDestroy(){
        this.setLongTerm(null);
        this.callParent();
    }



})
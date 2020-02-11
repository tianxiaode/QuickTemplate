/**
 * 日期区段选择字段
 */
Ext.define('Common.Desktop.ux.field.TimePeriod', {
    extend: 'Ext.field.Container',
    xtype: 'uxtimeperiod',

    requires:[
        'Common.Desktop.ux.field.Date'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    
    config:{
        startDateConfig: null,
        endDateConfig: null
    },
    
    items:[
        {
            xtype: 'uxdatefield',
            placeholder: I18N.StartDate,
            searchName: 'startDate',
            autoLabel: false,
            itemId: 'startDate',
            minDate: new Date(2019,1,1),
            maxDate: new Date( new Date().getFullYear()+1,11,31),
            isSearch: true,
            validators: function(v) {
                var start = this,
                    end = start.up().down('#endDate'),
                    startValue = start.getValue(),
                    endValue = end.getValue();
                if (
                    Ext.isEmpty(startValue) ||
                    Ext.isEmpty(endValue)
                )
                    return true;
                if (
                    typeof startValue !== 'object' ||
                    typeof endValue !== 'object'
                )
                    return true;
                return startValue.getTime() >
                    endValue.getTime()
                    ? I18N.StartDateGreater
                    : true;
            },
        },
        { xtype: 'component', html: '~', margin: '0 5px', style:'line-height:32px;' },
        {
            xtype: 'uxdatefield',
            placeholder: I18N.EndDate,
            autoLabel: false,
            searchName: 'endDate',
            itemId: 'endDate',
            minDate: new Date(2019,1,1),
            maxDate: new Date( new Date().getFullYear()+1,11,31),
            isSearch: true,
            validators: function(v) {
                var end = this,
                    start = end.up().down('#startDate'),
                    startValue = start.getValue(),
                    endValue = end.getValue();
                if (
                    Ext.isEmpty(startValue) ||
                    Ext.isEmpty(endValue)
                )
                    return true;
                if (
                    typeof startValue !== 'object' ||
                    typeof endValue !== 'object'
                )
                    return true;
                return startValue.getTime() >
                    endValue.getTime()
                    ? I18N.EndDateLess
                    : true;
            },
        },
    ],

    applyStartDateConfig(value){
        if(Ext.isObject(value)){
            this.initDateField('startDate',value);
        }
        return value;
    },

    applyEndDateConfig(value){
        if(Ext.isObject(value)){
            this.initDateField('endDate',value);
        }        
        return value;
    },

    initDateField(fieldName,config){
        let field = this.down('#' + fieldName);
        if(config.value) field.setValue(config.value);
        if(config.minDate) field.setMinDate(config.minDate);
        if(config.maxDate) field.setMaxDate(config.maxDate);

    }

});
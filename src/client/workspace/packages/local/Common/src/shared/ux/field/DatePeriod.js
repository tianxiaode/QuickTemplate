Ext.define('Common.shared.ux.field.DatePeriod',{
    extend: 'Ext.field.Container',
    xtype: 'uxdateperiodfield',

    requires:[
        'Common.shared.ux.field.Date'
    ],


    responsiveConfig:{
        desktop:{
            layout: 'hbox'
        },
        phone:{
            layout: 'vbox'
        }
    },

    autoLabel: false,
    container:{
        weighted: true,
    },

    config:{
        minDate: null,
        maxDate: null,
        dateRange: 90,
        start:{},
        separator:{
            xtype: 'component',
            margin: '0 5px 0 5px',
            userCls: 'lh-32',
            weight: 200,
            html: '~'
        },
        end: {}
    },


    createComponent(newCmp){
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);

    },

    createStartDateField(newCmp){
        let me = this,
            width = Ext.platformTags.phone ? '100%' : 125,
            minDate = me.getMinDate() || new Date(2019, 1,1),
            maxDate = me.getMaxDate() || new Date(2100,1,1);
        return Ext.apply({
            xtype: 'uxdatefield',
            autoLabel: false,
            ownerCmp: this,
            width: width,
            weight: 100,
            flex:1,
            requires: true,
            searchName: 'startDate',
            isSearch: true,
            minDate: minDate,
            maxDate: maxDate,
            value: Ext.Date.add(maxDate, Ext.Date.MONTH, -1),
            listeners:{
                change: 'onDateChange',
                scope: me
            }
        }, newCmp);
    },

    createEndDateField(newCmp){
        let me = this,
            width = Ext.platformTags.phone ? '100%' : 125,
            minDate = me.getMinDate() || new Date(2019, 1,1),
            maxDate = me.getMaxDate() || new Date(2100,1,1);
        return Ext.apply({
            xtype: 'uxdatefield',
            autoLabel: false,
            ownerCmp: this,
            weight: 300,
            width: width,
            flex:1,
            searchName: 'endDate',
            isSearch: true,
            requires: true,
            minDate: minDate,
            maxDate: maxDate,
            value: maxDate,
            listeners:{
                change: 'onDateChange',
                scope: me
            }
        }, newCmp);
    },

    applyStart(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createStartDateField');
    },

    updateStart(config){
        if(config) this.add(config);
    },

    applyEnd(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createEndDateField');
    },

    updateEnd(config){
        if(config) this.add(config);
    },

    applySeparator(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    updateSeparator(config){
        if(config && Ext.platformTags.desktop) this.add(config);
    },


    onDateChange(sender){
        let me = this,
            startField = me.getStart(),
            endField = me.getEnd();
        if(!startField.validate() || !endField.validate()) return;
        let start = startField.getValue(),
            end = endField.getValue()
            diff = Ext.Date.diff(start, end, Ext.Date.DAY);
        if(diff < 0){
            sender.setError( sender.searchName === 'start' 
                ? I18N.get('StartDateGreater')
                : I18N.get('EndDateLess'));
            return;
        }
        let range = me.getDateRange();
        if(diff > range){
            sender.setError(Format.format(I18N.get('DateRange'), range));
            return;
        }
        me.fireEvent('change', me, start, end);
    },

    updateDisabled(value){
        let me = this,
            start = me.getStart(),
            end = me.getEnd();
        if(start) start.setDisabled(value);
        if(end) end.setDisabled(value);
        me.callParent(arguments);
    }

})

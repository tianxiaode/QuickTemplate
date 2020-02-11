/**
 * 月份和年选择面板
 */
Ext.define('Common.Desktop.ux.panel.MonthYear', {
    extend: 'Ext.Panel',
    xtype: 'uxmonthyearpanel',
  
    requires: [
      'Ext.dataview.DataView',
      'Ext.layout.VBox',
      'Ext.Toolbar',
    ],
  
    config: {
      /**
       * @cfg {Date} value
       * The date currently selected.
       */
      value: null,
  
      maxHeight: 400,
      maxWidth: 340,
  
      /**
       * @cfg {Ext.dataview.List} list
       * The config for the month list.
       */
      monthList: {
        xtype: 'dataview',
        inline: true,
        userCls:'dataview-month',
        flex:1,
        itemCls: 'dataview-month-item',
        itemTpl:'{text}' ,
        weight: -50,
        store: {}
      },
  
      /**
       * @cfg {Ext.dataview.List} list
       * The config for the year list.
       */
      yearList: {
        xtype: 'dataview',
        inline: true,
        userCls:'dataview-month',
        flex: 1,
        itemCls: 'dataview-month-item',
        itemTpl:'{text}' ,
        weight: 50,
        store: {}
      },
  
  
      buttons: {
        cancel: true,
        ok: true
      }
    },

    /**
     * @cfg {Number} yearFrom
     * The year number to show years from.
     */
    yearFrom: 1980,

    /**
     * @cfg {Number} yearTo
     * The year number to show years to. Defaults
     * to the current year.
     */
    yearTo: new Date().getFullYear(),
    
    floated: true,
  
    layout: {
      type: 'hbox',
      align: 'stretch'
    },
  
    applyMonthList (list, oldList) {
      return Ext.factory(list, Ext.Component, oldList)
    },
  
    applyYearList (list, oldList) {
      return Ext.factory(list, Ext.Component, oldList)
    },
  
    updateMonthList (list) {
  
      if (list) {
        const store = list.getStore()
  
        if (!store.getCount()) {
          const date = new Date()
          const months = []
  
          while (months.length < 12) {
            date.setMonth(months.length)
  
            months.push({
              value: months.length,
              text: Ext.Date.format(date, 'F')
            })
          }
  
          store.setData(months)
        }
  
        this.add(list)
      }
    },
  
    applyValue (value) {
      if (Ext.isString(value)) {
        value = Ext.Date.parse(value, Ext.Date.defaultFormat)
      }
  
      return value
    },
  
    updateValue (value) {
      const monthList = this.getMonthList()
      const yearList = this.getYearList()
  
      if (value) {
        let store = monthList.getStore()
        let record = store.getAt(value.getMonth())
  
        monthList.getSelectable().select(record, false, true)
  
  
        store = yearList.getStore()
        record = store.findRecord('value', value.getFullYear())
  
        yearList.getSelectable().select(record, false, true)
  
      } else {
        monthList.setSelection()
        yearList.setSelection()
      }
    },
  
    updateYearList (list) {
      if (list) {
        const store = list.getStore()
  
        if (!store.getCount()) {
          let from = this.yearFrom,
            to = this.yearTo,
            years = []
  
          for (; from <= to; from++) {
            years.push({
              value: from,
              text: from
            })
          }
  
          store.setData(years)
        }
  
        this.add(list)
      }
    },

    initialize(){
        let me = this, buttons;
        me.callParent();
        buttons = buttons = me._buttons || me.getButtons();
        buttons.getItems().getByKey('ok').on('tap', me.onSelectMonthYear,me);
        buttons.getItems().getByKey('cancel').on('tap', me.onCancelSelectMonthYear,me);
    },

    onCancelSelectMonthYear: function () {
        this.hide()
    },
  
    onSelectMonthYear: function () {
      var me = this,
          value = me.getValue() || new Date(),
          monthList = me.getMonthList(),
          yearList = me.getYearList(),
          selected = monthList.getSelections()[0];  
      value.setMonth(selected.get('value'));  
      selected = yearList.getSelections()[0];  
      value.setYear(selected.get('value'));  
      me.fireEvent('valuechange', me, value);  
      me.hide();
    }    
    
  })
  
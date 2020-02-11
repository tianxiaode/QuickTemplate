/**
 * 添加年费和月份选择的日期面板
 */
Ext.define('Common.Desktop.ux.panel.Date', {
    extend: 'Ext.panel.Date',
    xtype: 'uxdatepanel',
  
    requires: [
        'Common.Desktop.ux.panel.MonthYear'
    ],

    config:{
      tools: {
        previousYear: {
          reference: 'navigatePrevYear',
          iconCls: 'x-fa fa-angle-double-left',
          cls: Ext.baseCSSPrefix + 'left-month-tool',
          weight: -90,
          increment: -12,
          focusable: false,
          tabIndex: null,
          forceTabIndex: true,
          listeners: {
            click: 'onMonthToolClick'
          }
        },
        nextYear: {
          reference: 'navigateNextYear',
          iconCls: 'x-fa fa-angle-double-right',
          cls: Ext.baseCSSPrefix + 'right-month-tool',
          weight: 90,
          increment: 12,
          focusable: false,
          tabIndex: null,
          forceTabIndex: true,
          listeners: {
            click: 'onMonthToolClick'
          }
        },
      },
      monthYearFloater: {
            lazy: true,
            $value: {
                xtype: 'uxmonthyearpanel',
                listeners: {
                  valuechange: 'onValueChange'
                }
            }
        },
        
    },


    updateHidden: function (hidden, oldHidden) {
        if (hidden && oldHidden === false) {
            const floater = this._monthYearFloater

            if (floater) {
            floater.hide()
            }
        }
        this.callParent(arguments);

        //this.superclass.updateHidden.call(this, hidden, oldHidden)
    },
    
    applyMonthYearFloater: function (floater, oldFloater) {
      let me = this;
      if (floater) {
          floater.$initParent = me;
          floater.yearFrom = me.yearFrom;
          floater.yearTo = me.yearTo;
      }

      return Ext.factory(floater, Ext.Container, oldFloater)
    },

      onDateCaptionTap: function (e) {
        const floater = this.getMonthYearFloater()
    
        if (floater) {
          const target = e.getTarget('.x-component', null, true);
          const value = this.getValue()
    
          floater.showBy(target)
    
          floater.setValue(value)
        }
      },
    
      onValueChange: function (view, value) {
        this.setValue(value)
      },

      updateNavigationPosition: function (pos) {
        this.callParent([ pos ])
    
        const toolCt = this.toolCt
        const cmp = toolCt.getAt(
          Math.floor(toolCt.innerItems.length / 2)
        )
    
        cmp.addCls('date-panel-caption')
    
        this.mon(cmp, {
          scope: this,
          stopEvent: true,
          element: 'element',
          tap: 'onDateCaptionTap'
        })
      },
    
    
          
});
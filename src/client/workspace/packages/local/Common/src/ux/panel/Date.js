Ext.define('Common.ux.panel.Date',{
    extend: 'Ext.panel.Date',
    xtype: 'uxdatepanel',

    requires:[
        'Common.ux.panel.Month',
    ],

    //maxHeight: 420,
    //minHeight: 420,

    config:{
        direction: 'horizontal',
        hideCaptions: false,

        navigationPosition: 'caption',
        buttonAlign: 'center',
        autoConfirm: false,
 
        //showFooter: true,
        showTodayButton: true,
    
    },

    buttonToolbar: {
        enableFocusableContainer: false,
        weight: 100,
        cls: Ext.baseCSSPrefix + 'datepanel-footer',
        reference: 'footer',
        layout:{
            type: 'hbox',
            pack: 'center'
        }
    },
 
    buttons: {
        footerTodayButton: {
            text: 'Today',
            tabIndex: -1,
            hidden: true,
            weight: -20,
            handler: 'onTodayButtonClick',
            reference: 'footerTodayButton'
        },
        spacer: false,
        ok: false,
        cancel: false,
    },


    header: {
        hidden: true,
        title: {
            xtype: 'datetitle'
        }
    },

    tools: {
        previousMonth: {
            reference: 'navigatePrevMonth',
            iconCls: 'x-fa fa-angle-left',
            cls: Ext.baseCSSPrefix + 'left-year-tool ',
            weight: -100,
            increment: -1,
            focusable: false,
            tabIndex: null,
            forceTabIndex: true,
            listeners: {
                click: 'onMonthToolClick'
            }
        },
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
        nextMonth: {
            reference: 'navigateNextMonth',
            iconCls: 'x-fa fa-angle-right',
            cls: Ext.baseCSSPrefix + 'right-year-tool',
            weight: 100,
            increment: 1,
            focusable: false,
            tabIndex: null,
            forceTabIndex: true,
            listeners: {
                click: 'onMonthToolClick'
            }
        }
    },


    initialize(){
        let me = this;
        me.callParent();
        if(Ext.platformTags.phone){
            me.bodyElement.on({
                dragstart: 'onDragStart',
                //drag: 'onDrag',
                dragend: 'onDragEnd',
                dragcancel: 'onDragEnd',            
                scope: me
            });    
        }

    },


    updateNavigationPosition(pos){
        let me = this;
        me.callParent(arguments);
        if (pos !== 'header') {
            let toolCt = me.toolCt,
             cmp = toolCt.getAt(Math.floor(toolCt.innerItems.length / 2));
    
            cmp.addCls('date-panel-caption')
    
            me.mon(cmp, {
                scope: me,
                stopEvent: true,
                element: 'element',
                tap: 'onDateCaptionTap'
            })

        }
    },


    updateAutoConfirm(autoConfirm) {
    },

    onDateCaptionTap(e) {
        let me = this,
            visible = !me.pickerVisible,
            picker = me.getYearPicker(),
            value = me.getValue(),
            year = value && value.getFullYear(),
            month = value && value.getMonth();
        picker.setYear(year);
        picker.setMonth(month+1);
        me.toggleYearPicker(visible);
    },


    privates:{

        createYearPicker(config) {
            let me = this,
                min = me.getMinDate(),
                start = min && min.getFullYear(),
                max = me.getMaxDate(),
                end = max && max.getFullYear();
            return Ext.apply({
                xtype: 'monthpanel',
                //floating: true,
                hidden: true,
                start: start,
                end: end,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                listeners: {
                    oktap: 'onYearPickerTap',
                    canceltap: 'onYearPickerCancelTap'
                }
            }, config);
        },

        onYearPickerCancelTap(){
            this.toggleYearPicker(false);

        },
    
        onYearPickerTap(picker, year, month) {
            let me = this;
            me.toggleYearPicker(false);
    
            // eslint-disable-next-line vars-on-top
            let  d = Ext.Date.clone(me.getFocusableDate());

            d.setFullYear(year);
            d.setMonth(month-1);
            
            me.setValue(d);
        },
    
        toggleYearPicker: function(visible) {
            var me = this,
                picker = me.getYearPicker();
 
            if (picker) {
                if (me.getSplitTitle()) {
                    me.getHeader().getTitle().setTitleActive(!visible);
                }
 
                picker.setHidden(!visible);
 
                // if (visible) {
                //     picker.focusYear(me.getFocusableDate().getFullYear());
                // }

                me.lookup('footer').setHidden(visible);
 
                me.pickerVisible = visible;
            }
        },

        onDragStart(e) {
            var me = this,
                absDeltaX = e.absDeltaX,
                absDeltaY = e.absDeltaY;
     
            me.isDragging = true;
            me.setDirection(absDeltaX > absDeltaY ? 'horizontal' : 'vertical');
     
     
        },

        updateMinDate(date) {
            let me = this,
                picker = me.getYearPicker();
            if(picker) picker.setStart(date.getFullYear());
            me.refreshPanes();
        },

        updateMaxDate(date) {
            let me = this,
                picker = me.getYearPicker();
            if(picker) picker.setEnd(date.getFullYear());
            me.refreshPanes();
        },
        
        onDrag(e) {
            var me = this,direction, delta;
     
            if (!me.isDragging) {
                return;
            }
     
            //水平滑动是1个月，垂直滑动是12个月
            direction = me.getDirection();
            delta = direction === 'horizontal' ? Ext.Number.sign(e.deltaX)*-1 : Ext.Number.sign(e.deltaY)*-12;
    
     
     
    
            if (delta && ! me.pickerVisible) {
                me.onMonthToolClick({
                    increment: delta
                });
            }
    
        },
     
        onDragEnd(e) {
            let me = this;
     
            if (!me.isDragging) {
                return;
            }
     
            me.onDrag(e);
     
            me.isDragging = false;
     
        },    
    
    },


})
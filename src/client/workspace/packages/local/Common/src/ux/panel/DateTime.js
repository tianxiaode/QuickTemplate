Ext.define('Common.ux.panel.DateTime',{
    extend: 'Common.ux.panel.Date',
    xtype: 'uxdatetimepanel',

    requires:[
        'Common.ux.panel.Time'
    ],

    isDataTimePanel: true,

    config:{
        hour: 0,
        minute: 0,
        second: 0,
        timePicker: {
            lazy: true,
            $value: {}
        },
        timePanel:{
            xtype: 'component'
        }
    },

    applyTimePanel(newCmp, old ){
        return Ext.updateWidget(old, newCmp,
            this, 'createTimePanel');
    },

    createTimePanel(newCmp){
        let me = this;
        return Ext.apply({
            ownerCmp: this,
            reference: 'timePanel',
            userCls: 'text-primary cursor-pointer',
            flex:1,
            listeners:{
                tap:{
                    element: 'element',
                    fn: me.onTimePanelTap,
                    scope: me
                }
            }
        }, newCmp);

    },

    applyTimePicker(timePicker, oldTimePicker) {
        return Ext.updateWidget(oldTimePicker, timePicker, this, 'createTimePicker');
    },
 
    updateTimePicker(timePicker) {
        if (timePicker) {
            this.add(timePicker);
        }
    },    

    initialize(){
        let me = this;
        me.callParent(arguments);
        me.lookup('footer').insert(0, me.getTimePanel());
        me.setTime(0,0,0);
    },

    setTimeValue(hour, minute, second){
        let me = this,
            timePanel = me.getTimePanel();
        if(!timePanel) {
            Ext.defer(me.setTimeValue, 50, me, [hour, minute, second]);
            return;
        };
        me.setHour(hour);
        me.setMinute(minute);
        me.setSecond(second);
        me.setTime(hour, minute, second);
        me.fireEvent('timechange', me, hour, minute, second);
    },

    setTime(hour, minute, second){
        this.getTimePanel().setHtml(`${Format.leftPad(hour, 2, '0')} : ${Format.leftPad(minute, 2, '0')} : ${Format.leftPad(second, 2, '0')}`);
    },

    onTimePanelTap(){
        let me = this,
            visible = !me.pickerVisible,
            picker = me.getTimePicker();
        picker.setValue(me.getHour(),me.getMinute(), me.getSecond());
        me.toggleTimePicker(visible);
    },

    privates:{
        createTimePicker(config) {
            let me = this;
            return Ext.apply({
                xtype: 'uxtimepanel',
                reference: 'timepicker',
                //floating: true,
                hidden: true,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                listeners: {
                    oktap: 'onTimePickerTap',
                    canceltap: 'onTimePickerCancelTap'
                }
            }, config);
        },

        onTimePickerCancelTap(){
            this.toggleTimePicker(false);

        },
    
        onTimePickerTap(picker, hour, minute, second) {
            let me = this;
            me.toggleTimePicker(false);
            
            me.setTimeValue(hour, minute, second);
        },
    
        toggleTimePicker(visible) {
            var me = this,
                picker = me.getTimePicker();
 
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

    }


});
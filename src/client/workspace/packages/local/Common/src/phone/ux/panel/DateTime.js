Ext.define('Common.phone.ux.panel.DateTime',{
    extend: 'Ext.Panel',
    xtype: 'commonphone-datetimepanel',

    requires:[
        'Ext.layout.Center',
        'Ext.field.Select',
        'Common.shared.ux.panel.Date',
        'Common.shared.ux.panel.DateTime',
        'Common.shared.ux.button.Back'
    ],

    config:{
        hour: 0,
        minute: 0,
        second: 0,
        minDate: null,
        maxDate: null,
        hasTime: null,
        //dateFormat: null,
        fieldId: null,
        dateTimePanel:{
            xtype: 'uxdatetimepanel',
        },
        value: null
    },
    fullscreen:true,
    alwaysOnTop: true,
    layout: 'center',
    scrollable: true,
    defaultListenerScope: true,

    header:{
        items:[
            {
                xtype: 'uxbackbutton',
                weight: -100,

            }
        ]
    },
    // height: '100%',
    // width: '100%',

    createComponent(newCmp) {
        let me = this;
        return Ext.apply({
            autoConfirm: true,
            listeners:{
                select: me.onDateSelect,
                timechange: me.onTimeChange,
                scope: me 
            },
            ownerCmp: me
        }, newCmp);
    },

    applyDateTimePanel(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    initialize(){
        var me = this;
        me.callParent();
        me.add(me.getDateTimePanel());
        me.timePanel = me.down('uxtimepanel');
        me.toggleTimePanel();
        me.on('resize', me.onResize, me);
    },

    updateHasTime(value){
        this.toggleTimePanel();
    },

    toggleTimePanel(){
        let me = this,
            hasTime = me.getHasTime();
        me.timePanel.setHidden(!hasTime);
    },

    updateMinDate(value){
        let me = this,
            panel = me.datePanel;
        if(!panel) return;
        panel.setMinDate(value);
    },

    updateMaxDate(value){
        let me = this,
            panel = me.datePanel;
        if(!panel) return;
        panel.setMaxDate(value);
    },

    onTimeChange(sender, name , value){
        let me = this;
        if(name === 'hour') me.setHour(value);
        if(name === 'minute') me.setMinute(value);
        if(name === 'second') me.setSecond(value);
    },

    onDateSelect(sender, value){
        let me = this,
            hasTime = me.getHasTime();
        if(hasTime){
            value.setHours(me.getHour());
            value.setMinutes(me.getMinute());
            value.setSeconds(me.getSecond());    
        }
        me.hide();
        me.fireEvent('change', me, value, me.getFieldId());

    },

    updateValue(value){
        if(Ext.isDate(value)){
            let panel = this.getDateTimePanel();
            panel.setTimeValue(value.getHours(), value.getMinutes(), value.getSeconds());
            panel.setValue(value);    
        }
    },

    onResize(width, height){        
        this.getDateTimePanel().setWidth(width)
    },

    onBack(){
        this.hide();
    }

})
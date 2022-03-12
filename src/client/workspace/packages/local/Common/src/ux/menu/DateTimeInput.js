Ext.define('Common.ux.menu.DateTimeInput', {
    extend: 'Common.ux.menu.Input',
    xtype: 'shared-uxdatetimeinputmenu',

    requires:[
        'Common.ux.panel.DateTime'
    ],

    autoHide: false,

    createInput(newCmp){
        return Ext.apply({
            //ownerCmp: me,
            xtype: 'uxdatetimepanel',
            //flex:1,
        }, newCmp);
    },

    updateInput(config){
        if(config){
            let container = this.add({ xtype: 'container', layout: 'center', flex:1});
            container.add(config);
            this.initDisplay();
        }
    },


    initInputValue(input ,value, type){
        input.setValue(value);
        input.setTimeValue(value.getHours(), value.getMinutes(), value.getSeconds())
    },
 
    getSubmitValue(field , value){
        let me = this,
            input = me.getInput();
        value = Ext.Date.add(value,Ext.Date.HOUR, input.getHour());
        value = Ext.Date.add(value,Ext.Date.MINUTE, input.getMinute());
        value = Ext.Date.add(value,Ext.Date.SECOND, input.getSecond());
        return value;       
    },

})
Ext.define('Common.shared.ux.menu.NumberInput', {
    extend: 'Common.shared.ux.menu.Input',
    xtype: 'shared-uxnumberinputmenu',

    layout: 'vbox',
    requires:[
        'Common.shared.ux.panel.NumberInput'
    ],

    createInput(newCmp){
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            xtype: 'uxnumberinputpanel',
            flex:1,
        }, newCmp);
    },


    initInputValue(input ,value, type){
        let decimals = type === 'int' ? 0 : 2; 
        input.setDecimals(decimals);
        input.setValue(value);
    },


 
})
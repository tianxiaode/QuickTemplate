Ext.define('Common.ux.form.Base',{
    extend: 'Ext.form.Panel',
    xtype: 'uxformpanel',

    mixins:[
        'Common.mixin.component.field.EnterEvent',
    ],

    requires:[
        'Ext.field.Hidden',
        'Ext.field.Password',
        'Ext.field.Text',
        'Ext.field.ComboBox',
        'Ext.field.Checkbox',
        'Ext.field.Radio',
        'Ext.field.Hidden',
        'Ext.field.Email',
        'Ext.field.Number',
        'Ext.field.Container'
    ],

    layout: 'auto',    

    userCls: 'flex-wrap-item',

    defaultType: 'textfield',
    trackResetOnLoad: true,
    defaults:{
        labelWidth: 150,
        width: '49%',
        userCls: 'mx-2'
    }


})
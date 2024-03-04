Ext.define('Common.ux.form.Base',{
    extend: 'Ext.form.Panel',
    xtype: 'uxformpanel',

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

    mixins:[
        'Common.mixin.field.EnterEvent',
        'Common.mixin.field.Id',
        'Common.mixin.field.ConcurrencyStamp',
    ],

    layout: 'auto',    

    userCls: 'flex-wrap-item',

    defaultType: 'textfield',
    trackResetOnLoad: true,
    
    config:{
        cols: 1,
        labelWidth: 150
    },

    defaults:{
        userCls: 'mx-1'
    },

    updateCols(cols){
        if(cols === 0) cols = 1;
        if(Ext.platformTags.phone) cols =1;
        let me = this,
            labelWidth = me.getLabelWidth(),
            items = me.getItems().items;
        Ext.each(items, item=>{
            if(!item.getWidth()){
                item.setWidth(`calc( ${100/cols}% - 8px)`);
            }
            if(item.getLangLabel()){
                item.setLabelWidth(labelWidth);
            }
        })
    }



})
Ext.define('Common.Desktop.view.base.form.Form',{
    extend: 'Ext.form.Panel',
    xtype: 'baseForm',

    mixins:[
        'Common.Desktop.view.base.form.FormController',
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
        'Ext.field.Date',
        'Ext.field.Number',
        'Ext.field.Container',
        'Common.Desktop.ux.Toast'
    ],

    ariaRole: 'dialog',
    modal:true,
    minWidth: 600,
    width: 'auto',
    height: 'auto',
    closable:true,
    closeAction: 'onHide',
    hideMode: 'display',
    closeToolText: I18N.CloseToolText,
    floated: true,
    centered: true,
    border: true,
    bodyBorder: false,
    shadow: true,
    trackResetOnLoad: true,
    defaultType: 'textfield',
    buttonsAlign: 'right',    
    focusable: false,
    tabIndex: -1,
  

    headerCls: Ext.baseCSSPrefix + 'dialogheader',
    titleCls: Ext.baseCSSPrefix + 'dialogtitle',
    toolCls: [
        Ext.baseCSSPrefix + 'paneltool',
        Ext.baseCSSPrefix + 'dialogtool'
    ],
    header:{
        border: false
    },

    classCls: Ext.baseCSSPrefix + 'dialog', 

    defaults: {
        labelWidth: 100
    },
    
    config:{
        isNew: false,
        defaultTitle: null,
        hasNewInSaved: false,
        isSavedSuccess: true,
        defaultModelValue: null,
        submitUrl: null,
        entityName: null,
        autoLabel: true,
        autoTabIndex: true,
        standardButtons: {
            saveAndNew:{ text: I18N.SaveAndNewButtonText, weight:10,  handler: 'onSaveAndNew'},
            save: {weight: 20, text: I18N.Save , handler: 'onSave'},
            reset: { text: I18N.Reset, weight: 30 , ui: 'soft-purple', handler: 'onReset'},
            cancel: {weight: 40, ui: 'soft-grey', text: I18N.Cancel, handler: 'onHide'}
        },
        buttonDefaults:{
            ui: 'action',
            margin: '0 5',
            style: 'line-height:24px;'
        }        
    },

    buttons:{ saveAndNew: true,save: true, reset: true, cancel: true},
    controller: 'baseForm',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },


    initialize: function(){
        let me = this;
        me.callParent();        
        me.on('hiddenchange', me.initFocus ,me);
    },

    //初始化焦点
    initFocus: function(sender, value, oldValue, eOpts){
        if(!value){
            let field = this.down('field[tabIndex]:not([readOnly])');
            if(field) field.focus();    
        }
    },

    onHide: function(){
        let me = this;
        let callback = me.callback;
        if(callback){
            let params = [me, me.getIsSavedSuccess(), me.getHasNewInSaved()];
            if(Ext.isFunction(callback)) Ext.callback(callback,null,params);
            if(Ext.isObject(callback) && Ext.isFunction(callback.fn)) {
                    Ext.callback(callback.fn, callback.scope,params );
            }    
        }
        me.hide();
    },

    addRecord: function(){
        this.getController().addRecord();
    },

    editRecord: function (record){
        this.getController().editRecord(record);
    },

    applyDefaultTitle(title){
        if(!Ext.isEmpty(title)){
            title = I18N[title];            
        }
        return title;
    }
   
});

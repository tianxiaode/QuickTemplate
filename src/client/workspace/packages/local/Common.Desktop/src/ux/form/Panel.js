Ext.define('Common.Desktop.ux.form.Panel',{
    extend: 'Ext.form.Panel',
    xtype: 'uxform',

    mixins:[
        'Common.Desktop.ux.form.PanelController',
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

    trackResetOnLoad: true,
    defaultType: 'textfield',

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

    /**
     * 添加记录
     */
    addRecord: function(){
        this.getController().addRecord();
    },

    /**
     * 编辑记录
     * @param {记录}} record 
     */
    editRecord: function (record){
        this.getController().editRecord(record);
    },

    /**
     * 应用默认标题
     * @param {标题} title 
     */
    applyDefaultTitle(title){
        if(!Ext.isEmpty(title)){
            title = I18N[title];            
        }
        return title;
    }
   
});

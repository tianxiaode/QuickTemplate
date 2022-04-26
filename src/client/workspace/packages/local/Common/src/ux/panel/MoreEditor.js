Ext.define('Common.ux.panel.MoreEditor',{
    extend: 'Ext.Container',
    xtype: 'uxmoreeditor',

    mixins:[
        'Common.mixin.component.Form',
        'Common.mixin.component.Textarea'
    ],
    

    requires:[
        'Ext.field.TextArea',
    ],

    layout: 'vbox',
    autoTabIndex: false,
    defaultListenerScope: true,
    alwaysOnTop: true,
    padding: 5,
    classCls: Ext.baseCSSPrefix + 'dialog', 
    modal:true,
    floated: true,
    centered: true,
    border: true,

    hasReset: true,
    callback: null,
    
    width: 400,
    height: 400,

    saveButton:{
        langText: null,
        iconCls: 'md-icon-done text-success',
        ui: 'defaults',
        cancelResponsive: true,
        weight: 30,
        ui: null
    },
    resetButton:{
        langText: null,
        iconCls: 'md-icon-undo',
        ui: 'defaults',
        cancelResponsive: true,
        weight: 10,
        ui: null
    },
    cancelButton:{
        langText: null,
        iconCls: 'md-icon-close text-danger',
        ui: 'defaults',
        cancelResponsive: true,
        weight: 20,
        ui: null
    },

    textarea:{
        flex: 1,
        hidden: false
    },

    config:{
        value: null,        
        // field:{
        //     xtype: 'textareafield',
        //     autoLabel: false,
        //     flex: 1
        // },
    },

    items:[
        {
            xtype: 'container',
            weighted: true,
            isCrudToolbar: true,
            layout: 'hbox',
            items:[
                {
                    xtype: 'component',
                    flex: 1,
                    weight: 0
                }
            ]
        }
    ],

    updateTextarea(config){
        if(config) this.insert(0, config);
    },


    updateValue(value){
        this.getTextarea().setValue(value);
    },


    onSave(){
        let me = this,
            value = me.getTextarea().getValue();
        me.callback.apply(null,[value]);
        me.hide();                
    },

    onReset(){
        this.getTextarea().setValue(this.getValue());
    },

    onCancel(){
        this.callback = null;
        this.hide();
    }

})
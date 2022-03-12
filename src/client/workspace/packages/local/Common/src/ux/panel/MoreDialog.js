Ext.define('Common.ux.panel.MoreDialog',{
    extend: 'Ext.Panel',
    xtype: 'shared-moredialog',

    requires:[
        'Ext.field.TextArea',
    ],

    trackResetOnLoad: true,
    defaultType: 'textareafield',
    layout: 'vbox',
    autoTabIndex: false,
    defaultListenerScope: true,
    alwaysOnTop: true,
    padding: 5,

    config:{
        fieldValue: null,        
    },

    responsiveConfig:{        
        desktop:{
            width: 300,
            height: 400,
            buttons:{
                ok:{
                    handler: 'onSave'
                },
                reset: {
                    handler: 'onReset'
                },
                cancel: {
                    handler: 'onHide',
                    weight: 100
                }
            },
        },
        phone:{
            ui: 'dark',
            autoTabIndex: false,
            header:{
                xtype: 'uxpanelheader',
                hasSelectAllMenu: false,
                buttons:{
                    done: {
                        handler: 'onSave'
                    },
                    reset: true,                    
                }
            }
        }
    },

    items:[
        { itemId: 'editField', flex:1, autoLabel: false }
    ],

    initialize(){
        let me = this;
        me.callParent();
        me.editField = me.down('#editField');
        me.editField.setValue(me.getFieldValue());
    },

    applyFieldValue(value){
        let me = this;
        if(me.editField) me.editField.setValue(value);
        return value;
    },


    onSave(){
        let me = this,
            value = me.editField.getValue();
        me.fireEvent('saved', me , value);
        me.hide();                
    },

    onReset(){
        this.editField.setValue(this.getFieldValue());
    }

})
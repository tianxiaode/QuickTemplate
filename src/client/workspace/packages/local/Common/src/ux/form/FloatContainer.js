Ext.define('Common.ux.form.FloatContainer',{
    extend: 'Ext.Container',
    xtype: 'uxfloatcontainer',
  
    requires:[
        'Ext.Responsive',
        'Ext.layout.Float',
        'Common.ux.field.Enumeration'
    ],

    layout: 'float',

    responsiveConfig:{
        desktop:{
            defaults:{
                labelWidth: 120,
                width: '50%',
                padding: 5
            },
        },
        phone:{
            defaults:{
                width: '100%',
            },        
        },
    },

 
    defaultType: 'textfield',
    
})
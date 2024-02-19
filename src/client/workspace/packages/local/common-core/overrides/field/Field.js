Ext.define('Common.overrides.field.Field', {
    override: 'Ext.field.Field',
    
    responsiveConfig:{
        'desktop && !cancel':{
            labelAlign: 'left'
        },
        'phone && !cancel':{
            errorTarget: 'qtip'
        }
    },

});
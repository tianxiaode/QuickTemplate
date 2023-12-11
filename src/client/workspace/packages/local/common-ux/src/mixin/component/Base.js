Ext.define('Common.mixin.component.Base',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            initialize: 'initialize',
            doDestroy: 'doDestroy'
        }
    },


    initialize(){},

    doDestroy(){}


})
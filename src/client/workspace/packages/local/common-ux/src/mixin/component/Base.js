Ext.define('Common.mixin.Component',{
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
Ext.define('Common.mixin.component.Base',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            initialize: 'initialize',
            destroy: 'destroy'
        }
    },


    initialize(){},

    destroy(){}


})
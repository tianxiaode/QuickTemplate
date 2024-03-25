Ext.define('Common.mixin.Component', {
    extend: 'Ext.Mixin',

    requires:[
        'Common.service.IconCls'
    ],
    mixinConfig: {
        configs: true,
        before:{
            beforeInitialize: 'beforeInitialize',
            initialize: 'initialize',
            doDestroy: 'doDestroy'
        },
        after:{
            initialize: 'afterInitialize',
            onLocalized: 'onLocalized',
            onConfigReady: 'onConfigReady'
        }
    },

    onLocalized(){},
    beforeInitialize(){},
    initialize(){},
    afterInitialize(){},
    onConfigReady(){},
    doDestroy(){}
});
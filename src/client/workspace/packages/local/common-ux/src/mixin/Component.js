Ext.define('Common.mixin.Component', {
    extend: 'Common.mixin.Base',

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
            onLocalized: 'onLocalized'
        }
    },

    onLocalized(){},
    beforeInitialize(){},
    initialize(){},
    afterInitialize(){},
    doDestroy(){}
});
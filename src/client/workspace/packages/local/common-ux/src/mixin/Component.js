Ext.define('Common.mixin.Component', {
    extend: 'Common.mixin.Base',

    mixinConfig: {
        before:{
            beforeInitialize: 'beforeInitialize',
            initialize: 'initialize',
            doDestroy: 'doDestroy'
        },
        after:{
            onLocalized: 'onLocalized'
        }
    },

    onLocalized(){},
    beforeInitialize(){},
    initialize(){},
    doDestroy(){}
});
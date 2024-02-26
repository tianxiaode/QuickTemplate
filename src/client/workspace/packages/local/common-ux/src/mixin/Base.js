Ext.define('Common.mixin.Base', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs:true,
        before:{
            doDestroy: 'doDestroy'
        }
    },


    doDestroy(){}
});
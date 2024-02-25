Ext.define('Common.mixin.crud.Base',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            doDestroy: 'doDestroy'
        }
    },
      
    doDestroy(){}

})

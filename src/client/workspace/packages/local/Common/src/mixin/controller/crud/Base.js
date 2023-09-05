Ext.define('Common.mixin.controller.crud.Base',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            doDestroy: 'doDestroy'
        },        
        after:{
            initList: 'initList'
        }
    },
      
    doDestroy(){},

    initList(){}
})

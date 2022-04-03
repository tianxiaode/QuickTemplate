Ext.define('Common.ux.crud.controller.mixin.Base',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            initList: 'initList'
        }
    },
        
})

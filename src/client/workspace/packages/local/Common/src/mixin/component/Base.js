Ext.define('Common.mixin.component.Base',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            initialize: 'initialize'
        }
    },

    getMixinContainer(){},

    initMixinComponent(){},

    initialize(){
        let me = this,
            container = me.getMixinContainer();
        if(!container) Ext.raise('No mixin container');
        me.initMixinComponent(me , container);
    }
})
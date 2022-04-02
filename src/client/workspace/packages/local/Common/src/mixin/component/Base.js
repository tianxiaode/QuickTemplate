Ext.define('Common.mixin.component.Base',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            initialize: 'initialize'
        }
    },

    mixinContainer: '[isCrudToolbar]',

    getMixinContainer(){
        let me = this;
        return (me.isFormPanel && me.isPhone() && me.getHeader()) || me.down(me.mixinContainer);
    },

    initialize(){}
})
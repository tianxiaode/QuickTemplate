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
        let me = this,
            isPhone = Ext.platformTags.phone;
        if(isPhone){
            return me.getHeader && me.getHeader();
        }
        return me.down(me.mixinContainer);
    },

    initialize(){}
})
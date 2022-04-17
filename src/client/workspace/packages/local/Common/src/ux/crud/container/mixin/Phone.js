Ext.define('Common.ux.crud.container.mixin.Phone',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            onLocalized: 'onLocalized'
        }
    },

    config:{
        title: null,
    },

    updateTitle(title){        
        this.onLocalized();
    },

    onLocalized(){
        let me = this,
            title= me.getTitle() || (me.isPhone() && me.getEntityName());
        me.getToolbar().setTitle({
            title: I18N.get(title, me.getResourceName()),
            centered: null,
            userCls: 'lh-36',
            flex: 1,
            weight: 0
        });
    }

})
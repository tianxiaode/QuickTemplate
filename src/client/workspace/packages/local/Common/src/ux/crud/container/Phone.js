Ext.define('Common.ux.crud.container.Phone',{
    extend: 'Common.ux.crud.container.Base',

    mixins:[
        'Common.mixin.component.Back',
        'Common.mixin.component.More',
    ],

    hasCountMessage: false,
    hasUpdate: false,
    hasRefresh: false,

    toolbarUi: 'dark',
    searchFieldUi: 'search',
    backMixinContainer: '[isCrudToolbar]',
    searchFieldMixinContainer: 'self',

    config:{
        title: null,
    },

    updateTitle(title){        
        this.onLocalized();
    },

    onLocalized(){
        let me = this,
            title= me.getTitle() || (me.isPhone() && me.getEntityName());
        me.callParent();
        me.getToolbar().setTitle({
            title: I18N.get(title, me.getResourceName()),
            centered: null,
            userCls: 'lh-36',
            flex: 1,
            weight: 0
        });
    }

})
Ext.define('Common.ux.crud.container.List',{
    extend: 'Common.ux.crud.container.Base',

    mixins:[
        'Common.ux.crud.container.mixin.Phone',
        'Common.ux.crud.container.mixin.List',
        'Common.mixin.component.Back',
        'Common.mixin.component.More',
    ],

    searchFieldMixinContainer: 'self',
    searchFieldUi: 'search',
    hasUpdate: false,
    hasRefresh: false,

    toolbarUi: 'dark',
    backMixinContainer: '[isCrudToolbar]',

})
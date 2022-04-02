Ext.define('Common.ux.crud.List',{
    extend: 'Common.ux.dataview.List',
    xtype: 'uxcrudlist',

    isCrudList: true,
    hasPullRefresh: true,
    childTap: true,
    childLongPress: true,
    weight: 500,
    bind:{ store: '{mainStore}'},    
    selectable:{
        mode: 'MULTI'
    }
})
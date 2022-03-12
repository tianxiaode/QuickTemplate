Ext.define('Common.ux.dataview.CrudList',{
    extend: 'Common.ux.dataview.List',
    xtype: 'uxcrudlist',

    isCrudList: true,
    hasPullRefresh: true,
    childTap: true,
    childLongPress: true,
    bind:{ store: '{mainStore}'},    
    selectable:{
        mode: 'MULTI'
    }
})
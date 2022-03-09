Ext.define('Common.shared.ux.dataview.CrudList',{
    extend: 'Common.shared.ux.dataview.List',
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
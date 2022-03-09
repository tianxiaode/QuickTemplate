Ext.define('Common.shared.ux.dataview.List',{
    extend: 'Ext.dataview.List',
    xtype: 'uxlist',

    requires:[
        'Ext.dataview.plugin.ListPaging',
        'Common.shared.ux.dataview.plugin.PullRefresh',
        'Common.shared.ux.dataview.plugin.Checkbox'
    ],

    hasPaging: true,
    hasPullRefresh: false,
    hasCheckbox: false,
    flex: 1,
    rowLines: true,
    striped: false,
    userCls: 'listing', 

    initialize(){
        let me = this;
        me.callParent(arguments);
        if(me.hasPaging)me.addPlugin({ type: 'listpaging', autoPaging: true});
        if(me.hasPullRefresh) me.addPlugin({ type: 'uxpullrefresh'});
        if(me.hasCheckbox) {
            me.addPlugin({ type: 'uxdataviewcheckbox'});
            me.shouldSelectItem = function(){return false};
        };
    }
   
})
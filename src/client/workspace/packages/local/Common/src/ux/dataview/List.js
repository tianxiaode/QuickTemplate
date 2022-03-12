Ext.define('Common.ux.dataview.List',{
    extend: 'Ext.dataview.List',
    xtype: 'uxlist',

    requires:[
        'Ext.dataview.plugin.ListPaging',
        'Common.ux.dataview.plugin.PullRefresh',
        'Common.ux.dataview.plugin.Checkbox'
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
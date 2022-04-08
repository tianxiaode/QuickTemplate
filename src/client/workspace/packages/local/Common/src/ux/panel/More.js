Ext.define('Common.ux.panel.More',{
    extend: 'Ext.Panel',
    xtype: 'uxmorepanel',

    isMorePanel: true,

    mixins:[
        'Common.mixin.component.TabBar',
        'Common.mixin.component.Back',
    ],

    width: 480,
    maxWidth: 480,
    resizable: {
        split: true,
        edges: 'west'
    },
    layout: 'vbox',
    collapsible: 'right',

    updateRecord(record){
        let me = this;
        me.switchTitle(me, record);
        me.refreshView(me, record);
    },

    switchTitle: Ext.emptyFn,

    refreshView(me, record){
        me.currentPage.getController().onRefreshView();    
    },

    onLocalized(){
        let me = this;
        me.callParent();
        me.switchTitle(me, me.getRecord());
    }

});

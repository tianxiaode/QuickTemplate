Ext.define('Common.ux.panel.Panel',{
    extend: 'Ext.Panel',
    xtype: 'uxpanel',

    layout: 'vbox',

    onBack(){
        Ext.util.History.replace(this.backView || 'homeview');
    },


})
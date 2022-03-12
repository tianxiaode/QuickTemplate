Ext.define('Common.ux.panel.Panel',{
    extend: 'Ext.Panel',
    xtype: 'uxpanel',

    isSubView: true,

    // config:{
    //     entityName: null,
    //     resourceName: null,
    //     includeResource: true,
    // },

    layout: 'vbox',

    onBack(){
        Ext.util.History.replace(this.backView || 'homeview');
    },


})
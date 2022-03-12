Ext.define('Common.ux.grid.Grid',{
    extend: 'Ext.grid.Grid',
    xtype: 'uxgrid',

    config:{
        grouped: false,
    },

    hasPaging: true,

    initialize() {
        let me = this;
 
        me.callParent();
        if(me.hasPaging){
            me.addPlugin({
                type: 'listpaging',
                autoPaging: true
            });
        }
    },

})

 
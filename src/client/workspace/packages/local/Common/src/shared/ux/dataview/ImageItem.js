Ext.define('Common.shared.ux.dataview.ImageItem', {
    extend: 'Common.shared.ux.Img',
    xtype: 'uximageitem',
 
    classCls: Ext.baseCSSPrefix + 'listitem',
 
    inheritUi: true,

    mixins: [
        'Ext.dataview.GenericItem',
    ],

    config:{
        urlField: 'url'
    },
 
    handleFocusEvent: Ext.emptyFn,
 
    updateRecord(record) {
        var me = this,
            dataview, data;
 
        if (me.destroying || me.destroyed) {
            return;
        }
 
        dataview = me.parent;
        data = dataview && dataview.gatherData(record);
        me.setUrl(record.get(me.getUrlField()));
        
        return record;
 
 
    },

 
});
Ext.define('Common.ux.grid.cell.Highlight', {
    extend: 'Ext.grid.cell.Cell',
    xtype: 'uxhighlightcell',

    config:{
        renderer: null
    },

    refreshValue(context) {
        let me = this,
            value = me.callParent(arguments),
            record = context.record,
            store = context.store;

        if(Ext.isEmpty(value)) return value;
        let remoteFilter = store.getRemoteFilter(),
            filter;
        if(remoteFilter || store.isTreeStore){
            let proxy = store.getProxy(),
                params = proxy.extraParams;
            filter = params && params.filter;
        }else{
            filter = store.filterValue;
        }
        if(Ext.isEmpty(filter)) return value;
        return Format.highlight(value, filter);

    }


});
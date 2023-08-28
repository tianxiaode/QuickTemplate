Ext.define('Common.ux.grid.cell.TristateCheck', {
    extend: 'Ext.grid.cell.Check',
    xtype: 'uxtristatecheckcell',

    config:{
        renderer: null
    },

    refreshValue(context) {
        let me = this,
            record = context.record,
            dataIndex = context.dataIndex,
            isSelectable = record.get('isSelectable'),
            value, dirty, modified,
            itemEl = me.element.up('.x-listitem');
        if(!isSelectable){
            itemEl && itemEl.addCls('x-unselectable');
            return value;
        }
        itemEl && itemEl.removeCls('x-unselectable');
        if (context.summary) {
            value = me.summarize(context);
        }
        else if (record && dataIndex) {
            value = record.get(dataIndex);
            modified = record.modified;
            dirty = !!(modified && modified.hasOwnProperty(dataIndex));

            if (dirty !== me.$dirty) {
                me.toggleCls(me.dirtyCls, dirty);

                me.$dirty = dirty;
            }
        }

        return value;
    },


    doDestroy(){
        this.setRenderer(null);
        this.callParent();
    }
});
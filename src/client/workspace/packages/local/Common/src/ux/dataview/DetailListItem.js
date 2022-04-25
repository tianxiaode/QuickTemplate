Ext.define('Common.ux.dataview.DetailListItem',{
    extend: 'Common.ux.dataview.ListItem',
    xtype: 'uxmdetailistitem',

    updateListItem(record){
        let me = this,
            data = record.data,
            html,
            editable = data.editable && 'x-editable' || '';
        html = Format.getListItem(data.label, data.text, editable, data.id, data.id, data.inputType);

        me.itemElement.setHtml(html);
    }
})


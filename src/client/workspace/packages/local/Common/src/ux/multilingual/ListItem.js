Ext.define('Common.ux.multilingual.ListItem',{
    extend: 'Common.ux.dataview.ListItem',
    xtype: 'uxmultilinguallistitem',

    updateItem(record){
        let me = this,
            data = record.data,
            html,
            text = data.readOnly ? Format.defaultValue(data.value, I18N.get('None') ) : Format.nullValueAndEditMessage(data.value);
        html = Format.getListItem(data.label, text , 'x-editable-text', data.id);
        me.itemElement.setHtml(html);


    }
})


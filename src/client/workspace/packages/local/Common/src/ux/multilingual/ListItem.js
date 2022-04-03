Ext.define('Common.ux.multilingual.ListItem',{
    extend: 'Common.ux.dataview.ListItem',
    xtype: 'uxmultilinguallistitem',

    updateItem(record){
        let me = this,
            data = record.data,
            html;
        html = `
            <div class="d-flex px-2 py-2">
                <div class="h6 text-dark" style="width:150px">${data.label}</div>
                <div class="flex-fill h6 black-54 text-right x-editable-text ${Format.nullValueColor(data.value)}" data-id="${data.id}">
                    ${Format.nullValueAndEditMessage(data.value)}
                </div>
            </div>
        `;
        me.itemElement.setHtml(html);
    }
})
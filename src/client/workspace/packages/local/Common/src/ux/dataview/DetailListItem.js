Ext.define('Common.ux.dataview.DetailListItem',{
    extend: 'Common.ux.dataview.ListItem',
    xtype: 'uxmdetailistitem',

    updateItem(record){
        let me = this,
            data = record.data,
            html;
        html = `
            <div class="d-flex px-2 py-2">
                <div class="h6 text-dark m-0 lh-24" style="width:150px">${data.label}</div>
                <div class="flex-fill h6 m-0 lh-24 text-black-50 text-right x-editable" data-id="${data.id}">
                    ${data.text}
                </div>
            </div>
        `;
        me.itemElement.setHtml(html);
    }
})


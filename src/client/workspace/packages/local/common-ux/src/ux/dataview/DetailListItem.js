Ext.define('Common.ux.dataview.DetailListItem',{
    extend: 'Common.ux.dataview.ListItem',
    xtype: 'uxmdetailistitem',

    updateListItem(record){
        let me = this,
            data = record.data,
            html,
            editable = data.editable && 'x-editable' || '';
        html = me.getListItem(data.label, data.text, editable, data.id, data.id, data.inputType);

        me.itemElement.setHtml(html);
    },

    getListItem(label,text,cls, id, field, inputType ){
        return `<div class="d-flex px-2 py-2">
            <div class="fw-bolder text-dark " style="width:150px;">${label}</div>
            <div class="flex-fill text-black-50 text-right ${cls} " data-field="${field}" data-type="${inputType}" data-id="${id}">
                ${text}
            </div>
        </div>`
    }

})


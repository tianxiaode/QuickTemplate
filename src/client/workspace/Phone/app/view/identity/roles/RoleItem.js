Ext.define('Phone.view.identity.roles.RoleItem', {
    extend: 'Common.ux.dataview.ListItem',
    xtype : 'phone-roleitem', 

    updateListItem(record){
        let me = this,
            data = record.data,
            html = '';
        html = `
            <div class="row">
                <div class="col-auto">
                    <div class="x-checkcell x-row-select" data-id="${data.id}">
                        <div class="x-checkbox-el x-font-icon"></div>
                    </div>
                </div>
                <div class="col">
                    <div class="text-truncate fw-bolder">${me.getHighlightValue(data.name, data, 'name')}</div>
                </div>
            <div>
            <div class="row py-1">
                <p class='m-0 p-0'>${data.displayPermissions}</p>
            <div>
        `;
        me.itemElement.setHtml(html);

    },

    actions:[
        { field: 'isDefault', type: 'bool'},
        { field: 'isPublic', type: 'bool'},
        'edit',
        'lang'
    ],


});
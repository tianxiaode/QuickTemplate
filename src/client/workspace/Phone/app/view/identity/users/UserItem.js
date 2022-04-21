Ext.define('Phone.view.identity.users.UserItem', {
    extend: 'Common.ux.dataview.ListItem',
    xtype : 'phone-useritem', 

    updateItem(record){
        let me = this,
            view = me.getResourceContainer(),
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
                    <div class="text-truncate fw-bolder">${me.getHighlightValue(data.userName, data, 'userName')} (${data.fullName})</div>
                </div>
            </div>
            <div class="row pt-1">
                <div class="col-8">${data.email}</div>
                <div class="col-4 text-right text-truncate">${Format.unDefine.apply(view, [data.phoneNumber, data, 'phoneNumber'])}</div>
            </div>
            <div class="row pt-1">
                ${Format.dateTime(data.creationTime)}
            </div>
        `;
        me.itemElement.setHtml(html);

    },

    actions:[
        { field: 'isActive', type: 'bool'},
        { field: 'lockoutEnabled', type: 'bool', text: 'Lockable'},
        { field: 'lockoutEnd', type: 'bool', text: 'UserLocked'},
        'edit',
        '.'

    ],


});
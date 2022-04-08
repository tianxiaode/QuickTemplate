Ext.define('Phone.view.identity.users.UserItem', {
    extend: 'Common.ux.dataview.ListItem',
    xtype : 'phone-useritem', 

    updateItem(record){
        let me = this,
            view = me.up('[includeResource]'),
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
                    <div class="text-truncate fw-bolder">${me.getHighlightValue(data.userName)} (${data.fullName})</div>
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

    updateItemAction(record){
        let me = this,
            permissions = me.getPermissions(),
            data = record.data,
            id = data.id,
            html = me.getItemActionTpl();
        
        html[1] = me.getCheckActionHtml(data.isActive, '', 'isActive', 'isActive');
        html[2] = me.getCheckActionHtml(data.lockoutEnabled, '', 'lockoutEnabled', 'Lockable');
        html[3] = me.getCheckActionHtml(data.lockoutEnd, '', 'lockoutEnd', 'UserLocked');
        if(ACL.isGranted(permissions.update)){
            html[4] = me.getIconActionHtml(id, 'x-fa fa-edit text-primary');
        }
        html[5] = me.getIconActionHtml(id, 'x-fa fa-ellipsis-h text-primary');
            
        me.actionElement.setHtml(html.join(''));

    }

});
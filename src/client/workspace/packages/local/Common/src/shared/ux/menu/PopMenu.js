Ext.define('Common.shared.ux.menu.PopMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'uxpopmenu',

    config:{
        entityName: null,
        permissionGroup: null,
        buttonHandlerScope: null,
    },


    hasMultiSelect: false,
    hasCopy: false,
    ui: 'dark',
    anchor: true,
    bodyPadding: 10,  
    includeResource: true,

    width: '96%',
    minHeight: 60,
    shadow: false,
    bodyStyle: 'border-radius:8px;',
    layout:{
        type: 'box',
        wrap: 'wrap',
        align: 'start',
    },

    defaults:{
        style: 'color: var(--divider-color)'
    },
    defaultType: 'button',
    defaultListenerScope: true,

    isGranted(permission){
        let me = this,
            entityName = me.entityName || (me.getEntityName && me.getEntityName()),
            group = `${me.getPermissionGroup() || entityName}.${Format.pluralize(entityName)}`;
        return ACL.isGranted(`${group}.${Ext.String.capitalize(permission)}`);
    },

    allowUpdate(){
        return this.isGranted('Update');
    },

    allowDelete(){
        return this.isGranted('Delete');
    },


    initialize(){
        let me = this,
            index = 0;
        me.callParent();

        if(me.allowUpdate()){
            me.insert(index,{ langText: 'Edit', handler: 'onUpdate' , scope: me.getButtonHandlerScope() });
            index++;
        }

        if(me.allowDelete()){
            me.insert(index, { langText: 'Delete', handler: 'onDelete', scope: me.getButtonHandlerScope() });
            index++;
        }

        if(me.hasMultiSelect){
            me.insert(index, { langText: 'MultiSelect', handler: 'onMultiSelect', scope: me.getButtonHandlerScope()});
            index++;
        }

        if(me.hasCopy){
            me.insert(index, { langText: 'Copy', handler: 'onCopy', scope: me.getButtonHandlerScope()});
        }

        me.getItems().items.forEach(item=>{
            item.setScope(me.getButtonHandlerScope());
        })


    },


 
})
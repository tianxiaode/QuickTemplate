Ext.define('Common.data.model.menumanagement.Menu', {
    extend: 'Common.data.model.Base',
    alias: 'entity.menuManagement.menu',

    autoLoad: false,
    hasTranslation: true,
    
    fields: [
        { name: 'parent'},
        { name: 'children'},
        { name: 'code', type: 'string' },
        { name: 'parentId'},
        { name: 'displayName', type: 'string'},
        { name: 'icon', type: 'string'},
        { name: 'isSelectable', type: 'boolean', defaultValue: true},
        { name: 'isDisabled', type: 'boolean', defaultValue: false},
        { name: 'order', type: 'integer'},
        { name: 'router', type: 'string'},
        { name: 'groupName', type: 'string'},
        { name: 'text', type: 'string'},
        {
            name: 'iconCls',
            convert(value, record) {
                let icon = record.get('icon');
                return icon && icon.includes('fa') ? 'x-fa ' + icon : icon;
            },
            depends: ['icon']
        }

    ]   

});

Ext.define('Common.data.model.Enum', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string'},
        { name: 'name', type : 'string'},
        { name: 'text', type : 'string'},
        { name: 'value', type: 'int'},
        { name: 'order', type: 'int'},
        { name: 'isDefault', type: 'bool'},
        { name: 'resourceName', type: 'string'}
    ],

});

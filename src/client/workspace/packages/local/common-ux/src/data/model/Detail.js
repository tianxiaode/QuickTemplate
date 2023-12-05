Ext.define('Common.data.model.Detail', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type : 'string'},
        { name: 'label', type : 'string'},
        { name: 'cls', type: 'string'},
        { name: 'value'},
        { name: 'text', type: 'string'},
    ]

});

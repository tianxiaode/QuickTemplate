Ext.define('Common.data.model.PhoneMenu', {
    extend: 'Common.data.model.Base',
    alias: 'entity.phonemenu',

    fields: [
        { name: 'text', type : 'string'},
        { name: 'iconCls', type : 'string'},
        { name: 'viewType', type : 'string'},
        { name: 'category', type : 'string'},
        { name: 'color', type : 'string'},
    ],
});

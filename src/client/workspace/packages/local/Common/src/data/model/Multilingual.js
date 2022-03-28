Ext.define('Common.data.model.Multilingual', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string'},
        { name: 'field', type : 'string'},
        { name: 'label', type : 'string'},
        { name: 'language', type : 'string'},
        { name: 'languageText', type : 'string'},
        { name: 'value', type : 'string'},
        { name: 'isMultiline', type: 'bool'},
        { name: 'order', type: 'int'}
    ],

});

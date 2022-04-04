Ext.define('Common.data.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Uuid'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'concurrencyStamp', type: 'string', defaultValue: null},
        { name: 'translations'},
        {
            name: 'translation',
            convert(value, record){
                let current = I18N.getCurrentLanguage();
                return (record.get('translations') || []).find(t=>t.language === current);
            },
            depends:[ 'translations']
        }
    ],
    idProperty: 'id',

    identifier: 'uuid',
    
    schema: {
        namespace: 'Common.data.model'
    }
});

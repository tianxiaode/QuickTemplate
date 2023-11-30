Ext.define('Common.core.data.Model', {
    extend: 'Ext.data.Model',

    requires: [
        'Common.core.service.Config',
        'Ext.data.identifier.Uuid'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'concurrencyStamp', type: 'string', defaultValue: null },
    ],

    idProperty: 'id',
    identifier: 'uuid',
    hasTranslation: false,


}, function () {
    let Model = this;
    Model.onExtended(function (cls, data) {
        if (data.hasTranslation) {
            cls.addFields(
                [
                    { name: 'translations' },
                    {
                        name: 'translation',
                        convert(value, record) {
                            let current = I18N.getLanguage();
                            return (record.get('translations') || []).find(t => t.language === current);
                        },
                        depends: ['translations']
                    }
                ]
            );
        }
    })
});

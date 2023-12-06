Ext.define('Common.data.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
        'Common.localized.Localized',
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
                    { name: 'translations' }
                ]
            );
            cls.addMember('getTranslation', (record, field) =>{
                let current = I18N.getCurrentLanguage(),
                    find = (record.get('translations') || []).find(t => t.language === current);
                return find ? find[field] : null;
            });
        }
    })
});

Ext.define('Common.data.model.TranslationBase', {
    extend: 'Common.data.model.Base',

    fields: [
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
});

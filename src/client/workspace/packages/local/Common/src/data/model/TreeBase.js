Ext.define('Common.data.model.TreeBase', {
    extend: 'Common.data.model.Base',

    fields: [
        { name: 'displayName',type: 'string', defaultValue: '', messageField: true, isTranslation: true },
        { name: 'code',type: 'string', defaultValue: ''},
        { name: 'parentId', type: 'string', defaultValue: null },
        { name: 'parent', defaultValue: null },
        { 
            name: 'parentName', 
            convert(value, record){
                let parent = record.get('parent');
                if(!parent) return;
                let displayName = parent.displayName,
                    translations = parent.translations;
                if(translations){
                    let current = I18N.getCurrentLanguage(),
                        find = translations.find(t=>t.language === current);
                    if(find) displayName = find.displayName;
                }
                return displayName;
            },
            depends:[ 'parent']

        }
    ]
        
})
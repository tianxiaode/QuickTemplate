Ext.define('Common.data.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Uuid'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'concurrencyStamp', type: 'string', defaultValue: null},
    ],
    idProperty: 'id',

    identifier: 'uuid',
    
    schema: {
        namespace: 'Common.data.model'
    },

    statics:{
        getAbc(){ return 1}
    }


},function(){
    let Model = this;
    Model.onExtended(function(cls, data) {
        if(data.hasTranslation){
            cls.addFields(
                [
                    { name: 'translations'},
                    {
                        name: 'translation',
                        convert(value, record){
                            let current = I18N.getCurrentLanguage();
                            return (record.get('translations') || []).find(t=>t.language === current);
                        },
                        depends:[ 'translations']
                    }    
                ]
            );
        }
    })
});


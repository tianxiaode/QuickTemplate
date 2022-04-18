Ext.define('Common.data.model.infrastructures.District', {
    extend: 'Common.data.model.TreeBase',
    alias: 'entity.district',

    hasTranslation: true,

    fields: [
        { name: 'postcode' ,  type: 'string'},
        { name: 'isMunicipality', type: 'bool', defaultValue: false},
    ],

})
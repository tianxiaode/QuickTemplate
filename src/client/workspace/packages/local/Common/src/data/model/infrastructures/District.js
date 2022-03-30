Ext.define('Common.data.model.infrastructures.District', {
    extend: 'Common.data.model.TreeBase',
    alias: 'entity.district',
   
    fields: [
        { name: 'postcode' ,  type: 'string'},
        { name: 'isMunicipality', type: 'bool', defaultValue: false},
        { name: 'translations' },
    ],

})
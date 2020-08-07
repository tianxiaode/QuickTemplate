Ext.define('Common.data.model.OrganizationUnit',{
    extend: 'Common.data.model.Base',

    fields:[
        { name: 'parentId', type: 'string' },
        { name: 'code', type: 'string'},
        { name: 'displayName', type: 'string'},
        { name: 'logo', type: 'string'},
        { name: 'serviceQrCode', type: 'string'},
        { name: 'shortName', type: 'string'},
        { name: 'servicePhone', type: 'string'},
    ]
})
Ext.define('Common.view.infrastructures.districts.District',{
    extend: 'Common.ux.crud.container.Tree',
    xtype: 'districtview',

    requires:[
        'Common.view.infrastructures.districts.Model',
        'Common.view.infrastructures.districts.Controller',
        'Common.view.infrastructures.districts.Edit',
        'Common.ux.multilingual.Form',
        'Common.ux.multilingual.Menu'
    ],


    viewModel: 'districtmodel',
    controller: 'districtcontroller',
    entityName: 'District',
    resourceName: 'Infrastructures',

    columns:[
        {
            dataIndex: 'postcode',
            renderer: Format.gridHighlight,
            cell:{  encodeHtml: false,},
            sortable: false, 
            width: 100,                
        },
    ]

})
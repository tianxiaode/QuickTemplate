Ext.define('Common.view.infrastructures.districts.District',{
    extend: 'Common.ux.crud.container.Tree',
    xtype: 'districtview',

    requires:[
        'Common.view.infrastructures.districts.Model',
        'Common.view.infrastructures.districts.Controller',
    ],


    viewModel: 'districtmodel',
    controller: 'districtcontroller',
    entityName: 'District',
    resourceName: 'Infrastructures',

})
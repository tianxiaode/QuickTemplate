Ext.define('Common.ux.field.District',{
    extend: 'Common.ux.field.TreeSelect',
    xtype: 'uxdistrictfield',

    name: 'district', 
    //required: true, 
    resourceName: 'Districts',
    entityName: 'District',
    getRoot(){
        return District.getRoot();
    },
    displayTpl: `{parent:getTranslationObjectText}{parent:separator}{displayName:translationItem(values,'displayName')}  {postcode}`,

    floatedPicker: {
        xtype: 'tree',
        minHeight: 300,
        maxHeight: 400,
        columns:[
            { 
                xtype: 'treecolumn',
                dataIndex: 'displayName', 
                renderer: Format.girdHighlight,
                cell:{  encodeHtml: false,},
                flex: 1
            },
            {
                dataIndex: 'postcode',
                renderer: Format.districtPostcode,
            },
        ]
    
    },


})
Ext.define('Common.view.infrastructures.districts.Edit',{
    extend: 'Common.ux.crud.form.Tree',
    xtype: 'districteditview',

    items:[
        {
            xtype: 'textfield', name: 'postcode', required: true,
            maxLength: 16
        },
    ]
})
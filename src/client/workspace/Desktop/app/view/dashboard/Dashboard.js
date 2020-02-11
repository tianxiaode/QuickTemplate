Ext.define('Desktop.view.dashboard.Dashboard',{
    extend: 'Ext.Container',
    xtype: 'admindashboard',

    requires:[
        'Ext.form.Panel',
        'Common.Desktop.ux.field.Date',
        'Common.Desktop.ux.field.DateTime',
        'Common.Desktop.ux.field.District',
        'Common.Desktop.ux.field.Image',
        'Common.Desktop.ux.field.TimePeriod',
        'Desktop.view.dashboard.TestDialog'
    ],

    //style: 'background-color:#fff;',

    layout:{
        type: 'vbox',
        align: 'stretch'
    },
    // responsiveConfig:{
    //     'width < 1490 || height < 904':{
    //         scrollable: true
    //     }
    // },

    items:[
        {
            xtype: 'formpanel',
            title: I18N.UxField,
            //ui: 'light',
            layout: 'float',
            defaults:{
                autoLabel: false,
                width: '49%',
                margin: '5px 5px 0 0',
                labelWidth: 140
            },
            items:[
                {
                    xtype: 'uxdatefield',
                    label: I18N.UxDateField + I18N.LabelSeparator,
                    required: true,
                },
                {
                    xtype: 'uxdatetimefield',
                    label: I18N.UxDateTimeField+ I18N.LabelSeparator,
                },
                {
                    xtype: 'districtField',
                    label: I18N.DistrictField+ I18N.LabelSeparator,
                    margin: '5px 10px 0 0',
                    width: '98%',

                },
                {
                    xtype: 'imagefield',
                    label: I18N.ImageField+ I18N.LabelSeparator,
                },
                {
                    xtype: 'uxtimeperiod',
                    label: I18N.TimePeriod+ I18N.LabelSeparator
                }
            ]
        },
        {
            xtype: 'panel',
            title: I18N.TestToast,
            padding: 20,
            items:[
                { 
                    xtype: 'button',
                    ui: 'action',
                    text: I18N.TestToast,
                    handler:function(){
                        Ext.toast(I18N.TestToast);
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Test dialog',
            padding: 20,
            items:[
                { 
                    xtype: 'button',
                    ui: 'action',
                    text: 'Test dialog',
                    handler:function(){
                        let dlg = DialogManager.show('testdialog');
                    }
                }
            ],
        }
    ]

});
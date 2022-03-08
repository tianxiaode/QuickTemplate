Ext.define('Desktop.view.dashboard.Dashboard',{
    extend: 'Ext.Container',
    xtype: 'desktop-admindashboard',

    requires:[
        'Ext.form.Panel',
    ],

    //style: 'background-color:#fff;',

    layout: 'vbox',
    // responsiveConfig:{
    //     'width < 1490 || height < 904':{
    //         scrollable: true
    //     }
    // },

    layout: 'vbox',

    items:[
        {
            xtype: 'component',
            langHtml: 'Login'
        },
        {
            xtype: 'button',
            langText: 'Login',
            langTooltip: 'Login'
        },
        {            
            xtype: 'panel',
            collapsible: true,
            flex: 1,
            langTitle: 'Login',
            buttons:{
                error: {
                    width: 36
                },
                fill:{
                    xtype: 'component',
                    flex: 1
                },
                ok: true,
                retry: true,
                ignore: true,
                yes: true,
                no: true,
                cancel: true,
                apply:true,
                save: true,
                submit: true,
                help: true,
                close: true
            },
            layout: 'vbox',
            items:[
                {
                    xtype: 'numberfield',
                    maxValue: 100,
                    minValue: 20,
                    langLabel: 'Login',
                    autoLabel: false,
                    langPlaceholder: 'Login',
                },
                {
                    xtype: 'checkboxfield',
                    name: 'Login'
                },
                {
                    xtype: 'textfield',
                    validators: 'email',
                    autoLabel: false,
                    langPlaceholder: 'Login'
                },
                {
                    xtype: 'datefield',
                    name: 'login',
                    minDate: new Date(2018,1,1),
                    maxDate: new Date(2020,11,30),
                }
            ]
        },
        {
            xtype: 'grid',
            flex: 1,
            plugins:{
                gridfilters: true,
                gridrowdragdrop: true,
                listpaging: {
                    autoPaging: true
                }
            },
            columns: [{
                //"text": "Login",
                "dataIndex": "login",
                // Locking On
                "locked": true
            }, {
                "text": "Email",
                "dataIndex": "email",
                "width": 250
            }, {
                "text": "Phone",
                "dataIndex": "phone",
                "width": 250
            }],
            store:{
                pageSize: 1,
                fields: ['login', 'email', 'phone'],
                data: [{
                    'login': 'Lisa',
                    "email": "lisa@simpsons.com",
                    "phone": "555-111-1224"
                }, {
                    'login': 'Bart',
                    "email": "bart@simpsons.com",
                    "phone": "555-222-1234"
                }, {
                    'login': 'Homer',
                    "email": "home@simpsons.com",
                    "phone": "555-222-1244"
                }, {
                    'login': 'Marge',
                    "email": "marge@simpsons.com",
                    "phone": "555-222-1254"
                }],                
            }
        
        }
    ]
});
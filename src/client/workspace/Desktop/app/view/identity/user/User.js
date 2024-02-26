Ext.define('Desktop.view.identity.user.User', {
    extend: 'Common.ux.panel.Content',
    xtype: 'users',

    requires:[
        'Common.data.store.identity.Users'
    ],

    paging: true,
    list:{
        store:{ type: 'users' },
        columns:[
            { 
                dataIndex: 'userName', flex:1,
                cell:{  encodeHtml: false},
                tpl: `{userName:this.highlight} ({fullName})`
            },
            { 
                dataIndex: 'email', flex:1,
                renderer: 'highlightRenderer',
                cell:{  encodeHtml: false},
            },
            { 
                dataIndex: 'phoneNumber', flex:1,
                renderer: Format.highlightRenderer,
                cell:{  encodeHtml: false,},
            },
            {
                xtype: 'uxdatecolumn', dataIndex: 'creationTime', 
            },
            { xtype: 'uxcheckchangecolumn', dataIndex: 'isActive' } ,
            {  
                xtype: 'uxcheckchangecolumn', dataIndex: 'lockoutEnabled',
                autoText: false, langText: 'Lockable'
            },
            {
                dataIndex: 'lockoutEnd',autoText: false, langText: 'UserLocked',
                flex:1,
                cell:{  encodeHtml: false,},
                tpl: `{lockoutEnd:dateTimeToCheckbox('lockoutEnd')}`

            }
        ]
    }

});
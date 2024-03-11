Ext.define('Desktop.view.identity.user.User', {
    extend: 'Common.ux.panel.content.Base',
    xtype: 'users',

    requires:[
        'Common.data.store.identity.Users',
        'Common.view.identity.user.Form'
    ],

    list:{
        store:{ type: 'users' },
        columns:[
            { 
                dataIndex: 'userName', flex:1,
                cell:{  encodeHtml: false},
                tpl: `{userName:this.highlight} ({fullName})`
            },
            { 
                xtype: 'uxhighlightcolumn', dataIndex: 'email', flex:1
            },
            { 
                xtype: 'uxhighlightcolumn', dataIndex: 'phoneNumber', flex:1
            },
            {
                xtype: 'uxdatecolumn', dataIndex: 'creationTime', 
            },
            { xtype: 'checkcolumn', dataIndex: 'isActive' } ,
            {  
                xtype: 'checkcolumn', dataIndex: 'lockoutEnabled'
            },
            {
                xtype: 'uxdatecolumn',
                dataIndex: 'lockoutEnd',
                showCheckbox: true,                
                flex:1
            }
        ]
    }

});
Ext.define('Desktop.view.identity.users.Crud', {
    extend: 'Ext.Panel',
    xtype : 'desktop-usercrudview', 

    requires:[
        // 'Common.view.identity.users.Controller',
    ],
    
    controller: 'usercontroller',

    grid:{
        doubleTapToEdit: true,
        childTap: true,
        flex:1,
        columns:[
            {
                dataIndex: 'creationTime', renderer: Format.dateTime,width: 180,
            },
            { 
                dataIndex: 'userName', flex:1,
                cell:{  encodeHtml: false,},
                tpl: `{userName:this.listHighlight(values, 'name')} ({fullName})`
            },
            { 
                dataIndex: 'email', flex:1,
                renderer: Format.gridHighlight,
                cell:{  encodeHtml: false,},
            },
            { 
                dataIndex: 'phoneNumber', flex:1,
                renderer: Format.gridHighlight,
                cell:{  encodeHtml: false,},
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
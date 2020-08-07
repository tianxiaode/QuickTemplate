Ext.define('Common.shared.view.authentication.SelectOrganizationUnit',{
    extend: 'Common.shared.view.authentication.LockingWindow',
    xtype: 'shared-selectorganizationunit',

    requires:[
        'Ext.dataview.List',
        'Common.shared.service.OAuth'
    ],

    title: 'SelectOrganizationUnit',
    defaultListenerScope: true,

    items:[
        {
            xtype: 'list',
            reference: 'organizationUnitList',
            userCls: 'listing',
            rowLines: true,
            striped: false,
            itemTpl:`
                <div class="row lh-30 h4 p-2">{displayName}</div>
            `,
            bind: { store: '{organizationunitofaccount}'},
            responsiveConfig:{
                desktop:{
                    width: 415,
                    height: 600
                },
                phone:{
                    flex:1,
                    width: '100%'
                }
            },
            listeners:{
                select: 'onSelect'
            }            
        },

    ],

    onSelect(sender, selected){
        AuthService.refreshToken(selected.getId());
    }

})
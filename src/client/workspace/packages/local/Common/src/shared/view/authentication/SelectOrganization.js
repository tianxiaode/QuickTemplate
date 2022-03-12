Ext.define('Common.view.authentication.SelectOrganization',{
    extend: 'Common.view.authentication.LockingWindow',
    xtype: 'shared-selectorganization',

    requires:[
        'Ext.dataview.List',
    ],

    langTitle: 'SelectOrganizationUnit',
    defaultListenerScope: true,

    items:[
        {
            xtype: 'component',
            langHtml: 'SelectOrganizationUnit',
            userCls: 'bg-white lh-30 p-1',  
            responsiveConfig:{
                desktop:{
                    hidden: false,
                    width: 415,
                    height: 32
                },
                phone:{
                    hidden: true
                }
            },
        },
        {
            xtype: 'list',
            reference: 'organizationUnitList',
            userCls: 'listing',
            rowLines: true,
            striped: false,
            itemTpl:`
                <div class="row lh-30 h4 p-2">{displayName}</div>
            `,
            store: {
                type: 'organizationunits',
                autoLoad: true,                
                pageSize: 0,
                remoteFilter: false,
                remoteSort: false,
                entity:[ 'OrganizationUnit', 'By-User']
            },
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
        Auth.refreshToken(selected.getId())
            .then(this.authSuccess, Failure.ajaxWithAlert,null, this);
    },

    authSuccess(){
        Config.loadConfiguration();
    }

})
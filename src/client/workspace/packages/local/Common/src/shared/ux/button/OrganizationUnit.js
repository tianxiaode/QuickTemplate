Ext.define('Common.shared.ux.button.OrganizationUnit',{
    extend: 'Ext.Button',
    xtype: 'organizationunitbutton',

    requires:[
        'Ext.menu.RadioItem'
    ],

    ui: 'action',
    iconCls: 'x-far fa-building',

    initialize(){
        const me = this;
        if(ConfigService.isReady) me.initMenu();
        Ext.on('configisready', me.initMenu, me);
        me.callParent();
    },

    initMenu(){
        const me = this,
            current = ConfigService.getCurrentOrganizationUnit(),
            currentId = current && current.id,
            menu = me.getMenu();
        if(!currentId) {
            me.setHidden(true);
            return
        };
        if(!menu){
            const store  =me.up('viewport').getViewModel().getStore('organizationunitofaccount');
            if(!store.isLoaded()){
                store.on('load', me.initMenu ,me);
                store.load();
                return;
            }
            me.setHidden(false);
            const menus = [];
            store.each(ou=>{
                const id = ou.get('id'),
                    displayName = ou.get('displayName');
                menus.push(me.getMenuItem(me, id, displayName, current.id === id ));
            });
            me.setMenu(menus);
            return;
        }        
            
    },

    getMenuItem(me, id, displayName, checked){
        return {
            xtype: 'menuradioitem',  
            value: id, 
            text: displayName, 
            group: 'ou',  
            checked: checked,
            handler: me.switchOrganizationUnit,
            scope: me
        }

    },

    switchOrganizationUnit(sender){
        if(!ConfigService.isReady){
            MsgBox.alert(null, I18N.getLocalText('WaitSwitch'))
            return;
        }
        AuthService.refreshToken(sender.getValue());
    }


})
/**
 * 切换组织按钮
 */
Ext.define('Common.shared.ux.button.Organization',{
    extend: 'Ext.Button',
    xtype: 'organizationbutton',

    requires:[
        'Ext.menu.RadioItem',
        'Common.shared.service.OAuth',
        'Common.shared.service.Config'
    ],

    ui: 'action',
    bind: { hidden: '{!isAuthenticated}'},
    responsiveConfig:{
        desktop:{
            iconCls: 'x-far fa-building',
            langTooltip: 'SelectOrganizationUnit',        
        },
        phone:{
            iconCls: 'md-icon-business',
            arrow: false,
            ui: 'plain'
        }
    },





    initialize(){
        let me = this;
        //判断配置信息是否已准备好
        if(Config.isReady) me.initMenu();
        Config.on('ready', me.initMenu, me);
        me.callParent();
    },

    initMenu(){
        let me = this,
            current = Config.getCurrentOrganizationUnit(),
            currentId = current && current.id,
            menu = me.getMenu();
        //如果不存在当前组织信息，隐藏按钮
        me.setHidden(!current);
        if(!currentId) return;
        //如果按钮已存在菜单，直接返回
        if(menu) return;
        let store  =me.up('viewport').getViewModel().getStore('organizationofaccount');
        //如果存储未加载，加载存储
        if(!store.isLoaded()){
            store.on('load', me.initMenu ,me);
            store.load();
            return;
        }
        let menus = [];
        store.each(ou=>{
            let id = ou.get('id'),
                displayName = ou.get('displayName');
            menus.push(me.getMenuItem(me, id, displayName, current.id === id ));
        });
        if(Ext.platformTags.desktop) {
            me.setMenu(menus);
        }else{
            me.setMenu({
                ui: 'dark',
                items: menus
            })
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

    /**
     * 切换组织
     * @param {事件触发者} sender 
     */
    switchOrganizationUnit(sender){
        let me = this;
        //如果配置信息未准备好，提醒用户不要频繁切换组�?
        if(!Config.isReady){
            MsgBox.alert(null, I18N.getLocalText('WaitSwitch'))
            return;
        }
        //准备刷新令牌
        Auth.on('refreshtokensuccess', me.refreshTokenSuccess, me, {single: true});
        Auth.refreshToken(sender.getValue());
    },

    refreshTokenSuccess(){
        //令牌刷新成功后，刷新页面以避免遗留数据影响
        window.location.href = '.';
    }


})
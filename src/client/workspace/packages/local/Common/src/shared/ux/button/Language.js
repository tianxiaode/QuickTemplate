/**
 * 语言选择按钮
 */
Ext.define('Common.shared.ux.button.Language',{
    extend: 'Ext.Button',
    xtype: 'languagebutton',

    requires:[
        'Ext.menu.RadioItem'
    ],

    ui: 'action',

    responsiveConfig:{
        phone:{
            iconCls: 'md-icon-language',
            arrow: false,
            ui: 'plain'
        }
    },


    onLocalized(){
        let me = this,
            isDesktop  = Ext.platformTags.desktop,
            current = I18N.getCurrentCulture(),
            displayName = current.cultureName.includes('zh') ? current.displayName: current.englishName;
        if(isDesktop) me.setLangText(displayName);
        me.callParent();
        //菜单已存在，直接返回
        if(me.getMenu()) return;
        //创建下拉菜单
        let menus = [];        
        I18N.getLanguages().forEach(l=>{
            menus.push({ 
                xtype: 'menuradioitem',
                //ui: isDesktop ? '' : 'dark',
                group: 'language',
                checked: l.cultureName === current.cultureName,
                value: l.cultureName , 
                langText: l.displayName, 
                handler: me.onSwitchLanguage,
                hideOnClick: true
            });
        });
        if(isDesktop) {
            me.setMenu(menus);
        }else{
            me.setMenu({
                ui: 'dark',
                items: menus
            })
        }
        
    },


    /**
     * 切换语言
     * @param {事件触发者} sender 
     */
    onSwitchLanguage(sender){
        I18N.switchLanguages(sender.getValue());
    }

})
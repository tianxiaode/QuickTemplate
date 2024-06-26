/**
 * 语言选择按钮
 */
Ext.define('Common.ux.button.Language',{
    extend: 'Ext.Button',
    xtype: 'uxlanguagebutton',

    requires:[
        'Ext.menu.RadioItem'
    ],

    responsiveConfig:{
        'desktop && !cancel':{
            iconCls: 'x-fa fa-globe',
            ui: 'header'
        },
        'phone && !cancel':{
            iconCls: 'md-icon-language',
            ui: 'plain'
        }
    },


    onLocalized(){
        let me = this,
            isPhone  = me.isPhone(),
            current = I18N.getCurrentCulture(),
            displayName = current.cultureName.includes('zh') ? current.displayName: current.englishName;
        !isPhone && me.setLangText(displayName);
        me.callParent();
        //菜单已存在，直接返回
        if(me.getMenu()) return;
        //创建下拉菜单
        let menu = { ui: isPhone && 'dark', items:[], anchor: true, resourceName: I18N.getDefaultResourceName() };
        I18N.getLanguages().forEach(l=>{
            menu.items.push({ 
                xtype: 'menuradioitem',
                group: 'language',
                checked: l.cultureName === current.cultureName,
                value: l.cultureName , 
                langText: l.displayName, 
                handler: me.onSwitchLanguage,
                hideOnClick: true
            });
        });
        me.setMenu(menu);
        
    },


    /**
     * 切换语言
     * @param {事件触发者} sender 
     */
    onSwitchLanguage(sender){
        I18N.switchLanguages(sender.getValue());
    }

})
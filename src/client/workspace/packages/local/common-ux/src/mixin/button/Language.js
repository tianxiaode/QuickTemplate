Ext.define('Common.mixin.button.Language', {
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.menu.RadioItem'
    ],

    config: {
        languageButton: null
    },

    createLanguageButton(config) {
        let me = this;
        return Ext.apply({
            xtype: 'button',
            ui: 'grey',
            hidden: true,
            langTooltip: 'language',
            iconCls: 'x-fa fa-globe',
            ownerCmp: me
        }, config);
    },

    applyLanguageButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createLanguageButton');
    },

    updateLanguageButton(config){
        config && this.add(config);
    },

    onLocalized(){
        let me = this,
            current = I18N.getCurrentCulture(),
            displayName = current.cultureName && current.cultureName.includes('zh') ? current.displayName: current.englishName,
            button = me.getLanguageButton(),
            menu = button.getMenu();
        if(!displayName) return;
        button.setLangText(displayName);

        //菜单已存在，直接返回
        if(menu) return;
        //创建下拉菜单
        menu = { ui: Ext.platformTags.phone && 'dark', items:[], anchor: true, resourceName: I18N.getDefaultResourceName() };
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
        button.setMenu(menu);
        button.setHidden(false);
        
    },


    /**
     * 切换语言
     * @param {事件触发者} sender 
     */
    onSwitchLanguage(sender){
        I18N.switchLanguages(sender.getValue());
    },



    doDestroy(){
        this.destroyMembers( 'languageButton');
    }


})

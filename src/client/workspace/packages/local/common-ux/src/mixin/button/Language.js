Ext.define('Common.mixin.button.Language', {
    extend: 'Common.mixin.Component',

    requires: [
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
            iconCls: IconCls.language,
            ownerCmp: me
        }, config);
    },

    applyLanguageButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createLanguageButton');
    },

    updateLanguageButton(config) {
        config && this.add(config);
    },

    onConfigReady() {
        this.onLocalized();
    },

    onLocalized() {
        if(!Config || !Config.isReady) return;
        let me = this,
            current = Config.getCurrentCulture();
            Logger.debug(this.onLocalized, 'current', current);
        if(!current) return;
        let displayName = current.displayName || current.englishName,
            button = me.getLanguageButton(),
            menu = button.getMenu();
        button.setText(displayName);

        //菜单已存在，直接返回
        if (menu) return;
        //创建下拉菜单
        menu = { 
            ui: Ext.platformTags.phone && 'dark', 
            items: [], anchor: true, 
            resourceName: Config.getDefaultResourceName() };
        Config.getLanguages().forEach(l => {
            menu.items.push({
                xtype: 'menuradioitem',
                group: 'language',
                checked: l.cultureName === current.cultureName,
                value: l.cultureName,
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
    onSwitchLanguage(sender) {
        let me = this,
            value = sender.getValue(),
            current = AppStorage.get('lang'),
            langs = Config.getLanguages(),
            currentCulture ;
        if (current === value) return;
        Ext.each(langs, (l)=>{
            if(l.cultureName === value){
                currentCulture = l;
                return false; 
            }
        })
        Config.setCurrentCulture(currentCulture);
        AppStorage.set('lang', value);
        I18N.loadResources();    
    },



    doDestroy() {
        this.destroyMembers('languageButton');
    }


})

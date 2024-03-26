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

    onLocalized() {
        let me = this,
            current = I18N.getCurrentCulture();
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
            resourceName: I18N.getDefaultResourceName() };
        Ext.each(I18N.getLanguages(), l => {
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
        I18N.switchLanguage(sender.getValue());
    },



    doDestroy() {
        this.destroyMembers('languageButton');
    }


})

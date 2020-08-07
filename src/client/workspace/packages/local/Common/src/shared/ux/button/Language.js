Ext.define('Common.shared.ux.button.Language',{
    extend: 'Ext.Button',
    xtype: 'languagebutton',

    ui: 'action',

    onLocalized(){
        const me = this,
            current = I18N.getCurrentCulture(),
            displayName = current.cultureName.includes('zh') ? current.displayName: current.englishName;
        me.setLangText(displayName);
        me.callParent();
        if(me.getMenu()) return;
        const menus = [];
        I18N.getLanguages().forEach(l=>{
            menus.push({ 
                value: l.cultureName , 
                langText: l.displayName, 
                handler: me.onSwitchLanguage,
            });
        });
        me.setMenu(menus);
        
    },


    onSwitchLanguage(sender){
        I18N.switchLanguages(sender.value);
    }

})
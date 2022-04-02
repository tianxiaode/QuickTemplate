Ext.define('Common.overrides.shared.Button',{
    override: 'Ext.Button',

    config:{
        langText: null,
        langTooltip: null,
    },


    onLocalized(){
        let me = this,
            resourceName = me.getResourceName(),
            langText = me.getLangText(),
            text = me.getText();
            
        if(text && !langText){
            me.setLangText(text);
        }

        text = me.getLocalizedText(me.getLangText(), resourceName);
        
        text && me.setText(text);

        text = me.getLocalizedText(me.getLangTooltip(), resourceName);
        
        text && me.setTooltip(text);
    },

    applyLangTooltip(value){
        return this.isPhone() ? '' : value;

    },

    applyUi(value){
        let me = this;
        return me.getPhoneValue(me.phoneUi) || value;
    },

    applyWeight(value){
        let me = this;
        return me.getPhoneValue(me.phoneWeight) || value;
    },

    updateIconCls(iconCls, oldIconCls) {
        let me = this;
        if(iconCls === 'desktop') iconCls = '';
        iconCls = me.getPhoneValue(me.phoneIconCls) || iconCls;

        let element = me.iconElement,
            hasIconCls = me.hasIconCls;

        if (iconCls) {
            me.addCls(hasIconCls);
            element.replaceCls(oldIconCls, iconCls);
        }
        else {
            element.removeCls(oldIconCls);

            if (!me.getIcon()) {
                me.removeCls(hasIconCls);
            }
        }
    },

    getPhoneValue(value){
        return this.isPhone() && value;
    }


})
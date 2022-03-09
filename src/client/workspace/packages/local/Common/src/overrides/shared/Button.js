Ext.define('Common.overrides.shared.Button',{
    override: 'Ext.Button',

    config:{
        langText: null,
        langTooltip: null,
    },


    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName(),
            langText = me.getLangText(),
            tooltip = me.getLangTooltip(),
            text = me.getText();

        if(text && !langText){
            me.setLangText(text);
        }
        text = me.getLangText();
        
        if(text){
            me.setText(I18N.get(text, resourceName));
        }
        if(tooltip){
            me.setTooltip(I18N.get(tooltip, resourceName));
        }
    },

    applyLangTooltip(value){
        if(Ext.platformTags.phone) return '';
        return value;
    },

    applyUi(value){
        let me = this;
        if(Ext.platformTags.phone && !Ext.isEmpty(me.phoneUi)) return me.phoneUi;
        return value;
    },

    applyWeight(value){
        let me = this;
        if(Ext.platformTags.phone && !Ext.isEmpty(me.phoneWeight)) return me.phoneWeight;
        return value;
    },

    // applyIconCls(value){
    //     let me = this;
    //     if(Ext.platformTags.phone && !Ext.isEmpty(me.phoneIconCls)){
    //         console.log(me.phoneIconCls);
    //         return `${me.phoneIconCls} ${value}`;
    //     }
    //     return value;
    // },

    updateIconCls(iconCls, oldIconCls) {
        let me = this;
        if(iconCls === 'desktop') iconCls = '';
        if(Ext.platformTags.phone && !Ext.isEmpty(me.phoneIconCls)){
            iconCls = me.phoneIconCls;
        }
            
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


    // applyPhoneIconCls(value){
    //     console.log(Ext.platformTags.phone, value);
    //     if(Ext.platformTags.phone && Ext.isEmpty(value)) this.setIconCls(value);
    //     return value
    // }

})
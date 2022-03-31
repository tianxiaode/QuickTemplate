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

    // applyLangTooltip(value){
    //     if(Ext.platformTags.phone) return '';
    //     return value;
    // },

    // applyUi(value){
    //     let me = this;
    //     if(Ext.platformTags.phone && !Ext.isEmpty(me.phoneUi)) return me.phoneUi;
    //     return value;
    // },

    // applyWeight(value){
    //     let me = this;
    //     if(Ext.platformTags.phone && !Ext.isEmpty(me.phoneWeight)) return me.phoneWeight;
    //     return value;
    // },

    // updateIconCls(iconCls, oldIconCls) {
    //     let me = this;
    //     if(iconCls === 'desktop') iconCls = '';
    //     if(Ext.platformTags.phone && !Ext.isEmpty(me.phoneIconCls)){
    //         iconCls = me.phoneIconCls;
    //     }
            
    //     let element = me.iconElement,
    //         hasIconCls = me.hasIconCls;

    //     if (iconCls) {
    //         me.addCls(hasIconCls);
    //         element.replaceCls(oldIconCls, iconCls);
    //     }
    //     else {
    //         element.removeCls(oldIconCls);

    //         if (!me.getIcon()) {
    //             me.removeCls(hasIconCls);
    //         }
    //     }
    // },



})
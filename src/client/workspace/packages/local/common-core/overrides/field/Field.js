Ext.define('Common.overrides.field.Field', {
    override: 'Ext.field.Field',

    config:{
        separator: ':',
        errorTarget: 'under',
    },
    

    responsiveConfig:{
        'desktop && !cancel':{
            labelAlign: 'left'
        }
    },

    getTemplate() {
        Logger.debug(this.getTemplate, this.name)
        return [
            {
                reference: 'labelElement',
                cls: Ext.baseCSSPrefix + 'label-el',
                tag: 'label',
                children: [{
                    reference: 'labelTextElement',
                    cls: Ext.baseCSSPrefix + 'label-text-el',
                    tag: 'span'
                }]
            }, 
            {
                reference: 'separatorElement',
                cls: Ext.baseCSSPrefix + 'separator',
            },
            {
            reference: 'bodyWrapElement',
            cls: Ext.baseCSSPrefix + 'body-wrap-el',
            children: [{
                reference: 'bodyElement',
                cls: Ext.baseCSSPrefix + 'body-el',
                children: this.getBodyTemplate()
            }, {
                reference: 'errorElement',
                cls: Ext.baseCSSPrefix + 'error-el',
                children: [{
                    reference: 'errorIconElement',
                    cls: Ext.baseCSSPrefix + 'error-icon-el ' +
                    Ext.baseCSSPrefix + 'font-icon'
                }, {
                    reference: 'errorMessageElement',
                    cls: Ext.baseCSSPrefix + 'error-message-el'
                }]
            }]
        }];
    },
    
    updateSeparator(separator){
        let me = this,
            autoLabel = me.getAutoLabel(),
            isLeft = me.getLabelAlign() === 'left';
        Logger.debug(this.updateSeparator, autoLabel)
        if(!isLeft || !autoLabel || me.isCheckbox) return;
        me.separatorElement.dom.style.padding = '7px 5px 7px 0';
        me.separatorElement.dom.innerHTML = separator;
    }

});
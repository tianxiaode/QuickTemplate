Ext.define('Common.overrides.field.Field', {
    override: 'Ext.field.Field',

    config:{
        separator: ':',
        separatorAlign: 'label'
    },
    
    getTemplate() {
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

    updateLabelAlign(){
        this.callParent(arguments);
        this.updateSeparator(this.getSeparator());
    },
    
    updateSeparator(separator){
        let me = this,
            label = me.getLabel(),
            align = me.getSeparatorAlign(),
            isLeft = me.getLabelAlign() === 'left';
        Logger.debug(this.updateSeparator, me.name, label, separator, align, me.getLabelAlign());
        if(!isLeft || !label || me.isCheckbox) return;
        if(align === 'label'){
            me.setLabel(label + separator);
            return;
        }
        me.separatorElement.dom.style.padding = '7px 5px 7px 0';
        me.separatorElement.dom.innerHTML = separator;
    },

    updateUnderError(error) {
        let el = this.errorMessageElement.dom;
        el.innerHTML = error || '';
        el.title = Ext.String.htmlDecode(error) || '';
    },

});
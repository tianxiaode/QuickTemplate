Ext.define('Common.mixin.button.Help', {
    extend: 'Common.mixin.Component',

    config: {
        helpButton: null
    },

    createHelpButton(config) {
        let me = this,
            handler = 'onHelpButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'success',
            langTooltip: 'Help',
            iconCls: 'x-far fa-question-circle',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyHelpButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createHelpButton');
    },

    updateHelpButton(config){
        config && this.add(config);
    },

    updateHelpText(text){
        let me = this,
            html = me.getLocalizedText(text);
        me.setMenu({
            items:[
                {
                    xtype: 'component',
                    flex: 1,
                    html: html
                }
            ]
        });
    },

    doDestroy(){
        this.destroyMembers( 'helpButton');
    }


})

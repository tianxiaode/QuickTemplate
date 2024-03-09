Ext.define('Common.mixin.button.Help', {
    extend: 'Common.mixin.Component',

    config: {
        helpButton: null
    },

    createHelpButton(config) {
        let me = this;
        return Ext.apply({
            xtype: 'button',
            isHelp: true,
            langTooltip: 'Help',
            arrow: false,
            menuAlign: 'br',
            iconCls: 'x-far fa-question-circle',
            handler: me.onHelpButtonTap.bind(me),
            menu:{
                minWidth: 400,
                anchor: true,
                items:[
                    {
                        xtype: 'component',
                        flex: 1,
                        html: me.getLocalizedText(config.helpText)
                    }
                ]
            },
            ownerCmp: me
        }, config);
    },

    applyHelpButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createHelpButton');
    },

    updateHelpButton(config){
        config && this.add(config);
    },

    onHelpButtonTap(){
        this.getHelpButton().getMenu().show();
    },

    doDestroy(){
        Ext.destroy(this.getHelpButton().helpText); 
        this.destroyMembers( 'helpButton');
    }


})

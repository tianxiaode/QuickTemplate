Ext.define('Common.overrides.shared.Panel',{
    override: 'Ext.Panel',

    config:{
        langTitle: null,
        standardButtons: {
            error:{
                iconCls: 'x-fa fa-times-circle',
                ui: 'error',
                minWidth:24,
                weight: 0
            },
            ok: {
                ui: 'action',
                langText: 'OK',
            },
            abort: {
                ui: 'soft-grey',
                langText: 'Abort',
            },
            retry: {
                ui: 'action',
                langText: 'Retry',
            },
            ignore: {
                ui: 'soft-grey',
                langText: 'Ignore'
            },
            yes: {
                ui: 'action',
                langText: 'Yes'
            },
            no: {
                ui: 'soft-grey',
                langText: 'No'
            },
            cancel: {
                ui: 'soft-grey',
                langText: 'Cancel'
            },
            apply: {
                ui: 'action',
                langText: 'Apply'
            },
            save: {
                ui: 'action',
                langText: 'Save'
            },
            submit: {
                ui: 'action',
                langText: 'Submit'
            },
            help: {
                ui: 'soft-green',
                langText: 'Help'
            },
            close: {
                ui: 'soft-grey',
                langText: 'Close'
            }
        }

    },

    cachedConfig:{
        buttonToolbar: {
            xtype: 'toolbar',
            itemId: 'buttonToolbar',
            docked: 'bottom',
            defaultType: 'button',
            weighted: true,
            ui: 'footer',
            defaultButtonUI: 'action',
            defaults:{
                margin: '0 0 0 5'                
            },
 
            layout: {
                type: 'box',
                vertical: false,
                pack: 'center'
            }
        },        
    },

    onLocalized(){
        const me = this,
            resourceName = me.getResourceName(),
            title = me.getLangTitle(),
            collapsible = me.getCollapsible && me.getCollapsible();
        if(collapsible){
            collapsible.setCollapseToolText(I18N.get('CollapseToolText'));
            collapsible.setExpandToolText(I18N.get('ExpandToolText'));
        }
        if(title){
            me.setTitle(I18N.get(title, resourceName));
        }
        me.callParent();
    },

   
});
 
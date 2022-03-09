Ext.define('Common.overrides.shared.Panel',{
    override: 'Ext.Panel',

    requires:[
        'Common.shared.ux.button.Message',
    ],

    config:{
        langTitle: null,
        standardButtons: {
            message:{
                xtype: 'uxmessagebutton'
            },
            // error:{
            //     xtype: 'uxerrorbutton'
            // },
            // success:{
            //     xtype: 'uxsuccessbutton'
            // },
            fill:{
                xtype: 'component',
                flex: 1,
                weight: 5
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
            saveAndNew:{
                xtype: 'uxsaveandnewbutton',
                // ui: 'action',
                // langText: 'SaveAndNew',
                weight: 85
            },
            save: {
                ui: 'action',
                langText: 'Save'
            },
            reset:{
                xtype: 'uxresetbutton',
                // langText: 'Reset',
                weight: 95,
                // ui: 'soft-purple'
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
            },
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
                margin: '0 0 0 5',                
                style: 'line-height:24px;'
            },
 
            layout: {
                type: 'box',
                vertical: false,
                pack: 'center'
            }
        },        
    },

    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName(),
            langTitle = me.getLangTitle(),
            collapsible = me.getCollapsible && me.getCollapsible();
        if(me.closeTool){
            me.closeTool.setTooltip({ zIndex:20, html: I18N.get('Close') });
        }
        if(collapsible){
            collapsible.setCollapseToolText(I18N.get('CollapseToolText'));
            collapsible.setExpandToolText(I18N.get('ExpandToolText'));
        }
        if(Ext.isString(langTitle)){
            me.setTitle(I18N.get(langTitle, resourceName));
        }
        if(Ext.isArray(langTitle)){
            let title = '';
            langTitle.forEach(t=>{
                title+= I18N.get(t, resourceName);
            });
            me.setTitle(title);
        }
        me.callParent();
    },

   
});
 
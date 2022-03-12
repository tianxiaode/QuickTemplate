Ext.define('Common.ux.form.Base',{
    extend: 'Common.ux.form.Panel',

    requires:[
        'Common.ux.panel.Header',
        'Common.ux.form.BaseController',
    ],

    controller: 'shared-formbasecontroller',
    hasSaveAndNewButton: true,
    hasResetButton: true,

    title: '\xA0',
    config:{
        defaultTitle: null,
        defaultModelValue: null,
        remoteController: null,
        autoTabIndex: true,
        userButtons: null,
        defaults:{
            labelWidth: 150
        },
        ui: 'desktop',
    },

    hasMessageButton: false,
    hasCreate: false,
    hasDelete: false,

    applyAutoTabIndex(){
        return Ext.platformTags.desktop;
    },

    applyUi(ui){
        if(Ext.platformTags.phone) return 'dark';
        if(ui === 'desktop') return null;
        return ui;
    },


    getPhoneDefaultButtons(){
        return {
            message: {
                xtype: 'uxmessagebutton',
            },
            done: {
                handler: 'onSave',                    
            },
        }
    },

    getDesktopDefaultButtons(){
        return {
            message: true,
            fill: true,
            ok: {
                handler: 'onSave'
            },
            cancel: {
                handler: 'onCancel',
                weight: 100
            }
        }
    },

    createHeader(config) {
        var me = this,
            isPhone = Ext.platformTags.phone,
            xtype = isPhone ? 'uxpanelheader' : 'panelheader',
            ret = {
                xtype: xtype,
                instanceCls: me.headerCls,
                docked: 'top',            
            },
            icon, title;

        if(isPhone){
            ret.buttons = me.getPhoneDefaultButtons();
        }

        me._isCreatingHeader = true;

        if (config && config !== true) {
            Ext.merge(ret, config);
        }

        if (me.initialized) {
            // Only attempt to configure title if we are not currently initializing.
            // During initialization the updater for title will run if present and apply
            // it to the header so there is no work to be done here.
            title = me.getTitle();

            if (title != null) {
                if (typeof title === 'string') {
                    title = {
                        text: title
                    };
                }

                Ext.merge(ret, {
                    title: title
                });
            }

            icon = me.getIconCls();

            if (icon != null) {
                ret.iconCls = icon;
            }
            else {
                icon = me.getIcon();

                if (icon != null) {
                    ret.icon = icon;
                }
            }
        }

        me._isCreatingHeader = false;

        return ret;
    },


    initialize(){
        let me = this;
        me.callParent(arguments);
        me.initDefaultButtons();
        me.initUserButtons();
    },



    initDefaultButtons(){
        let me = this;
        if(Ext.platformTags.desktop){
            me.setButtons(me.getDesktopDefaultButtons());
        }
    },

    initUserButtons(){
        let me = this,
            container = Ext.platformTags.desktop ? me.down('toolbar[ui=footer]') : me.getHeader(),
            buttons = me.getUserButtons() || [];
        if(buttons.length === 0) return;
        container.add(buttons);
    },

    onHide(){
        this.getController().onHide();
    }

})
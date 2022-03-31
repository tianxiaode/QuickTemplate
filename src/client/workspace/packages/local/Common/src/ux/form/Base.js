Ext.define('Common.ux.form.Base',{
    extend: 'Common.ux.form.Panel',

    mixins:[
        'Common.mixin.component.Form',
        'Common.mixin.component.Message'
    ],

    requires:[
        'Common.ux.form.BaseController',
    ],

    controller: 'shared-formbasecontroller',

    title: '\xA0',
    closeAction: 'hide',
    config:{
        defaultTitle: null,
        defaultModelValue: null,
        remoteController: null,
        autoTabIndex: true,
        defaults:{
            labelWidth: 150
        },
        buttonDefaults:{
            margin: '0 5px 0 0'
        },
        ui: 'desktop',
        buttons:[
            {
                xtype: 'component',
                flex: 1,
                weight: 5
            }
        ]
    },


    applyAutoTabIndex(){
        return Ext.platformTags.desktop;
    },

    applyUi(ui){
        if(Ext.platformTags.phone) return 'dark';
        if(ui === 'desktop') return null;
        return ui;
    },


    getButtonContainer(){
        return Ext.platformTags.phone ? this.getHeader() : this.down('#buttonToolbar');
    },

    onHide(){
        this.getController().onCancel();
    }



})
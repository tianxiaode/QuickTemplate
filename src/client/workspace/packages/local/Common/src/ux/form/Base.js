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
    mixinContainer: '#buttonToolbar',
    config:{
        defaultTitle: null,
        defaultModelValue: null,
        remoteController: null,
        autoTabIndex: true,
        defaults:{
            labelWidth: 150
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


    onHide(){
        this.getController().onCancel();
    }



})
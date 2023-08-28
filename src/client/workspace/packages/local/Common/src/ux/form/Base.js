Ext.define('Common.ux.form.Base',{
    extend: 'Common.ux.form.Panel',

    mixins:[
        'Common.mixin.component.Back',
        'Common.mixin.component.Form',
        'Common.mixin.component.Message'
    ],

    requires:[
        'Common.ux.form.BaseController'
    ],

    controller: 'formbasecontroller',
    

    title: '\xA0',
    mixinContainer: '#buttonToolbar',
    config:{
        defaultTitle: null,
        defaultModelValue: null,
        remoteController: null,
        autoTabIndex: true,
        defaults:{
            labelWidth: 150
        },
        buttons:[
            {
                xtype: 'component',
                flex: 1,
                weight: 5
            }
        ]
    },

    responsiveConfig:{
        'phone && !cancel':{
            ui: 'dark'
        }        
    },

    applyAutoTabIndex(){
        return Ext.platformTags.desktop;
    },

    onHide(){
        this.getController().onCancel();
    },

    doDestroy(){
        this.setLongTerm(null);
        this.callParent();
    }



})
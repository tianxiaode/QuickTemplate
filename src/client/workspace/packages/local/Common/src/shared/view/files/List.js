Ext.define('Common.view.files.List',{
    extend: 'Common.ux.dataview.List',
    xtype: 'uxfilelist',

    requires:[
        'Common.ux.dataview.plugin.LabelEditor',
        'Common.view.files.FileItem',
    ],

    hasPaging: true,
    hasEditor: false,
    hasCheckbox: true,
    selectable:{
        mode: 'MULTI',
    },
    inline:true,
    flex:1,
    bind:{ store: '{mainStore}'},
    autoLoad: true,
    isCrudList: true,
    itemConfig:{
        xtype: 'shared-uxfileitem'
    },

    initialize(){
        let me = this;
        me.callParent(arguments);
        if(me.hasEditor) {
            me.addPlugin({ 
                type: 'dataviewlabeleditor',
                dataIndex: 'description',
                ignoreNoChange: true,
                updateEl: true,
                field:{
                    required: true,
                    maxLength: 128
                },
            })
        };
    },


})
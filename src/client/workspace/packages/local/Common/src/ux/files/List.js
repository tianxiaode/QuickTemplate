Ext.define('Common.ux.files.List',{
    extend: 'Common.ux.dataview.List',
    xtype: 'uxfilelist',

    requires:[
        'Common.ux.files.FileItem',
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



})